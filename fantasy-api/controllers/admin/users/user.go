package users

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"fantasy-api/pkg/cache"
	"fantasy-api/pkg/captcha"
	"fantasy-api/pkg/event"
	"fantasy-api/pkg/jwt"
	"fantasy-api/utils"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"k8s.io/klog"
	"strconv"
)

type UserController struct {
	base.AdminController
}

// @router /login [post]
func (c *UserController) Login() {
	var User UserLoginParams
	var err error
	var user *models.Author

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &User); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if ok := captcha.IsValid(User.Captcha); !ok {
		c.HandleBadRequest(utils.TriggerError("验证码有误"))
		return
	}

	if user, err = models.AuthorModel.CheckAdminLogin(User.Username, User.Password); err != nil {
		c.HandleUnauthorized(utils.TriggerError(err.Error()))
		return
	}

	// 生成一个jwt token
	claims := jwt.UserClaims{
		UserID:   user.UserId,
		Username: user.Name,
		Email:    user.Email,
		Avatar:   user.Avatar,
	}

	tokenExpire := utils.TimeGranularityConversion(beego.AppConfig.String("admin_user_token_expire"))

	result := new(UserAuthResponse)

	if token, err := jwt.GenerateToken(claims, tokenExpire); err != nil {
		result.ErrorCode = 5000
		result.ErrorMessage = err.Error()
	} else {
		result.Data = token
	}

	c.JsonResponse(result)
}

// @router /currentUser [get]
func (c *UserController) CurrentUser() {

	var claims *jwt.Claims
	var err error

	token := c.Ctx.Request.Header.Get("Authorization")

	if claims, err = jwt.Authentication(token); err != nil {
		c.HandleUnauthorized(err)
		return
	}

	c.JsonResponse(claims)
}

// @router /listLabels [get]
func (c *UserController) ListLabels() {

	var lists []*models.Author
	var result []ListSearchLabels

	_, _ = models.Orm().QueryTable(models.AuthorTableName).Limit(1000).All(&lists)

	if len(lists) != 0 {
		for _, record := range lists {
			result = append(result, ListSearchLabels{
				Label: record.Name,
				Value: record.UserId,
			})
		}
	}
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /info [get]
func (c *UserController) UserInfo() {

	currentName := c.Controller.CurrentUser().Username

	user, err := models.AuthorModel.QueryUserInfoByName(currentName)

	if err != nil {
		c.HandleNotFound()
		return
	}

	c.SuccessResponse(user, &base.QueryParam{})
}

// @router /:id [put]
func (c *UserController) Put() {

	var data UserBasicPutFields
	var err error

	userId := c.Ctx.Input.Param(":id")

	if userId == "" {
		c.HandleBadRequest(utils.TriggerError("用户ID未找到"))
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	updateFields := orm.Params{
		"avatar":      data.Avatar,
		"display":     data.Display,
		"gender":      data.Gender,
		"city":        data.City,
		"description": data.Description,
	}

	if _, err := models.Orm().QueryTable(models.AuthorTableName).Filter("user_id", userId).Update(updateFields); err != nil {
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /userSecurity [get]
func (c *UserController) UserSecurity() {

	currentName := c.Controller.CurrentUser().Username

	user, err := models.AuthorModel.QueryUserInfoByName(currentName)

	if err != nil {
		c.HandleNotFound()
		return
	}

	result := &UserSecurityInfo{
		UserId:   user.UserId,
		UserName: user.Name,
		Password: user.Password,
		Email:    user.Email,
	}

	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /sendEmailCaptcha [get]
func (c *UserController) SendEmailCaptcha() {

	email := c.Ctx.Input.Query("email")

	if email == "" {
		c.HandleBadRequest(utils.TriggerError("email is not found"))
		return
	}

	random := utils.GenRandom()
	title := "邮箱修改验证码"
	body := fmt.Sprintf("您好, 本次验证码为: %s\n", random)

	if err := event.SendMailBy163([]string{email}, title, body); err != nil {
		klog.Errorf("send email captcha error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, email)
	cache.SET(key, random, utils.TimeGranularityConversion("1m"))
	c.SuccessResponse(email, &base.QueryParam{})
}

// @router /changeEmail [post]
func (c *UserController) ChangeEmail() {
	var body UserSecurityEmailUpdate
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &body); err != nil {
		c.HandleBadRequest(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, body.SrcEmail)

	if result, err := cache.GET(key); err != nil {
		c.HandleBadRequest(utils.TriggerError("请确认是否发送验证码?"))
		return
	} else if result != body.Captcha {
		c.HandleBadRequest(utils.TriggerError("验证码错误!"))
		return
	}

	obj := models.AuthorModel.GetObject(body.UserId)

	if obj == nil {
		c.HandleNotFound()
		return
	}

	if _, err := obj.Update(orm.Params{"email": body.DstEmail}); err != nil {
		klog.Errorf("author update email error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	cache.DELETE(key)
	c.SuccessResponse(body, &base.QueryParam{})
}

// @router /changePassword [post]
func (c *UserController) ChangePassword() {
	var body UserSecurityPasswordUpdate
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &body); err != nil {
		c.HandleBadRequest(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, body.Email)

	if result, err := cache.GET(key); err != nil {
		c.HandleBadRequest(utils.TriggerError("请确认是否发送验证码?"))
		return
	} else if result != body.Captcha {
		c.HandleBadRequest(utils.TriggerError("验证码错误!"))
		return
	}

	saltPassword := models.AuthorModel.EnsurePassword(body.SrcPassword)

	var obj models.Author

	if err = models.Orm().QueryTable(obj.TableName()).Filter("user_id", body.UserId).Filter("password", saltPassword).One(&obj); err != nil {
		c.HandleBadRequest(utils.TriggerError("原密码有误!"))
		return
	}

	if err = obj.SetPassword(body.DstPassword); err != nil {
		c.HandleServerError(err)
		return
	}

	cache.DELETE(key)
	c.SuccessResponse(body, &base.QueryParam{})
}

// @router /userNoticeSetting [get]
func (c *UserController) UserNoticeSetting() {
	currentName := c.Controller.CurrentUser().Username

	user, err := models.AuthorModel.QueryUserInfoByName(currentName)

	if err != nil {
		c.HandleNotFound()
		return
	}

	result := &UserSettingNotice{
		UserId:              user.UserId,
		IsLikeNotice:        user.IsLikeNotice,
		IsCommentNotice:     user.IsCommentNotice,
		IsFollowNotice:      user.IsFollowNotice,
		IsPrivateChatNotice: user.IsPrivateChatNotice,
	}

	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /userNoticeSetting [post]
func (c *UserController) PutUserNoticeSetting() {
	var data UserSettingNotice
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	columns := orm.Params{
		"isLikeNotice":        data.IsLikeNotice,
		"isCommentNotice":     data.IsCommentNotice,
		"isFollowNotice":      data.IsFollowNotice,
		"isPrivateChatNotice": data.IsPrivateChatNotice,
	}

	if _, err = models.Orm().QueryTable(models.AuthorTableName).Filter("user_id", data.UserId).Update(columns); err != nil {
		klog.Errorf("update admin user notice info error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /dialogue [get]
func (c *UserController) DialogueList() {

	var result []models.DialogueMessage
	var err error

	userInfo := c.Controller.CurrentUser()

	if userInfo.UserID == "" {
		c.ErrorResponse(401, "auth failed")
		return
	}

	if result, err = models.PrivateMessageModel.DialogueList(userInfo.UserID); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /dialogue/message [get]
func (c *UserController) DialogueDetail() {

	var articleId int
	var result []models.PrivateMessageResponse
	var err error

	userId := c.Ctx.Input.Query("userId")
	authorId := c.Ctx.Input.Query("authorId")
	rawArticleId := c.Ctx.Input.Query("articleId")

	if userId == "" || authorId == "" || rawArticleId == "" {
		c.ErrorResponse(400, "参数有误")
		return
	}

	if articleId, err = strconv.Atoi(rawArticleId); err != nil {
		c.ErrorResponse(400, "文章ID有误")
		return
	}

	params := &models.DialogueDetailQueryParams{
		UserId:    userId,
		AuthorId:  authorId,
		ArticleId: articleId,
	}

	result = models.PrivateMessageModel.GetAuthorMessages(params.UserId, params.AuthorId, params.ArticleId)
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /dialogue/message [post]
func (c *UserController) SendMessage() {
	var data models.PrivateMessageRequestBody
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if err = models.PrivateMessageModel.AddMessage(&data); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	if ok := models.AuthorModel.IsPrivateMessageNotice(data.AuthorId); ok {
		SendUserNoticeByEmail("作者私信通知", data.UserId, PrivateMessageBodyFormat(data))
	}

	c.OperationAudit(data, "作者私信")
	c.SuccessResponse(data, &base.QueryParam{})
}
