package public

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"fantasy-api/pkg/cache"
	"fantasy-api/pkg/captcha"
	"fantasy-api/pkg/event"
	"fantasy-api/utils"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"k8s.io/klog"
)

type UserLoginBody struct {
	Username string `json:"loginUsername"`
	Password string `json:"loginPassword"`
	Captcha  string `json:"loginCaptcha"`
}

type UserRegisterBody struct {
	Username        string `json:"registerUsername"`
	Password        string `json:"registerPassword"`
	ConfirmPassword string `json:"registerConfirmPassword"`
	Email           string `json:"registerEmail"`
	Captcha         string `json:"registerCaptcha"`
}

type UserResetPasswordBody struct {
	Email           string `json:"email"`
	Captcha         string `json:"captcha"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

type UserBasicPutFields struct {
	Avatar      string `json:"avatar"`
	Display     string `json:"display"`
	Gender      int    `json:"gender"`
	Description string `json:"description"`
}

type UserController struct {
	base.PublicController
}

type UserSecurityInfo struct {
	UserId   string `json:"userId"`
	UserName string `json:"userName"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type UserSecurityPasswordUpdate struct {
	UserId          string `json:"userId"`
	UserName        string `json:"userName"`
	Email           string `json:"email"`
	SrcPassword     string `json:"srcPassword"`
	DstPassword     string `json:"dstPassword"`
	ConfirmPassword string `json:"confirmPassword"`
	Captcha         string `json:"captcha"`
}

type UserSecurityEmailUpdate struct {
	UserId   string `json:"userId"`
	SrcEmail string `json:"srcEmail"`
	DstEmail string `json:"dstEmail"`
	Captcha  string `json:"captcha"`
}

// @router /login [post]
func (c *UserController) Login() {
	var data UserLoginBody
	var err error
	var user *models.User

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if ok := captcha.IsValid(data.Captcha); !ok {
		c.ErrorResponse(400, "验证码有误")
		return
	}

	if user, err = models.UserModel.Login(data.Username, data.Password); err != nil {
		c.ErrorResponse(401, err.Error())
		return
	}

	c.SetSession("userId", user.UserId)

	if err = models.UserLoginModel.Add(user.UserId, user.Name); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.OperationAudit(user, "用户登录")
	c.SuccessResponse(user, &base.QueryParam{})
}

// @router /logout [get]
func (c *UserController) Logout() {
	values := c.GetSession("userId")

	if values == nil {
		c.SuccessResponse(values, &base.QueryParam{})
		return
	}

	c.DelSession("userId")
	c.SuccessResponse(values, &base.QueryParam{})
}

// @router /register [post]
func (c *UserController) Register() {
	var data UserRegisterBody
	var user *models.User
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if ok := captcha.IsValid(data.Captcha); !ok {
		c.ErrorResponse(401, "验证码有误")
		return
	}

	if ok := models.UserModel.UserIsExist(data.Username); ok {
		c.ErrorResponse(400, "用户已存在")
		return
	}

	if data.Password != data.ConfirmPassword {
		c.ErrorResponse(400, "两次密码输入有误")
		return
	}

	if user, err = models.UserModel.Register(data.Username, data.Password, data.Email); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	tpl := fmt.Sprintf("您好，请点击以下链接进行激活用户: <a href=%s/api/v1/public/users/activation/%s>激活账户</a>", beego.AppConfig.String("host"), user.UserId)

	if err = event.SendMailBy163([]string{data.Email}, "用户注册", tpl); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.SuccessResponse(user, &base.QueryParam{})
}

// @router /activation/:id [get]
func (c *UserController) Activation() {
	userId := c.Ctx.Input.Param(":id")

	if userId == "" {
		c.Redirect("/", 302)
		return
	}

	if err := models.UserModel.ActivationUser(userId); err == nil {
		c.Redirect("/user/login", 302)
		return
	}
}

// @router /currentUser [get]
func (c *UserController) CurrentUser() {
	var user *models.User
	var err error

	userId := c.GetSession("userId")

	if userId == nil {
		c.HandleUnauthorized(utils.TriggerError("sessionId not found"))
		return
	}

	if user, err = models.UserModel.QueryUserInfoById(userId.(string)); err == nil {
		c.SuccessResponse(user, &base.QueryParam{})
		return
	}

	c.HandleUnauthorized(err)
}

// @router /sendResetCaptcha/ [get]
func (c *UserController) SendResetCaptcha() {
	email := c.Ctx.Input.Query("email")

	if email == "" {
		c.HandleBadRequest(utils.TriggerError("email is not found"))
		return
	}

	if ok := models.UserModel.EmailIsExist(email); !ok {
		c.ErrorResponse(400, "邮箱未注册")
		return
	}

	random := utils.GenRandom()
	title := "重置密码"
	body := fmt.Sprintf("您好, 本次验证码为: %s\n", random)

	if err := event.SendMailBy163([]string{email}, title, body); err != nil {
		klog.Errorf("send email captcha error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, email)
	cache.SET(key, random, utils.TimeGranularityConversion("3m"))
	c.SuccessResponse(email, &base.QueryParam{})
}

// @router /resetPassword [post]
func (c *UserController) ResetPassword() {
	var data UserResetPasswordBody
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, data.Email)

	if result, err := cache.GET(key); err != nil {
		c.ErrorResponse(400, "请确认是否发送验证码?")
		return
	} else if result != data.Captcha {
		c.ErrorResponse(400, "验证码错误!")
		return
	}

	cache.DELETE(key)

	if err = models.UserModel.ResetPassword(data.Email, data.Password); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /:id [put]
func (c *UserController) Put() {
	var data UserBasicPutFields
	var err error

	if !c.IsLogin() {
		c.HandleUnauthorized(utils.TriggerError("auth failed"))
		return
	}

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
		"description": data.Description,
	}

	if err = models.UserModel.UpdateBasicInfo(userId, updateFields); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.OperationAudit(updateFields, "用户基本信息修改")
	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /userSecurity [get]
func (c *UserController) PublicUserSecurity() {
	var user *models.User
	var err error

	userId := c.GetSession("userId")

	if userId == nil {
		c.HandleUnauthorized(utils.TriggerError("sessionId not found"))
		return
	}

	if user, err = models.UserModel.QueryUserInfoById(userId.(string)); err == nil {
		p := &UserSecurityInfo{
			UserId:   user.UserId,
			UserName: user.Name,
			Password: user.Password,
			Email:    user.Email,
		}
		c.SuccessResponse(p, &base.QueryParam{})
		return
	}

	c.HandleUnauthorized(err)
}

// @router /sendEmailCaptcha [get]
func (c *UserController) PublicSendEmailCaptcha() {

	if !c.IsLogin() {
		c.HandleUnauthorized(utils.TriggerError("auth failed"))
		return
	}

	email := c.Ctx.Input.Query("email")

	if email == "" {
		c.HandleBadRequest(utils.TriggerError("email is not found"))
		return
	}

	random := utils.GenRandom()
	title := "邮箱修改"
	body := fmt.Sprintf("您好, 本次验证码为: %s\n", random)

	if err := event.SendMailBy163([]string{email}, title, body); err != nil {
		klog.Errorf("send email captcha error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	key := fmt.Sprintf(captcha.UserEmailCaptchaKey, email)
	cache.SET(key, random, utils.TimeGranularityConversion("1m"))

	c.OperationAudit(email, "用户邮箱修改验证码")
	c.SuccessResponse(email, &base.QueryParam{})
}

// @router /changePassword [post]
func (c *UserController) ChangePassword() {
	var body UserSecurityPasswordUpdate
	var err error

	if !c.IsLogin() {
		c.HandleUnauthorized(utils.TriggerError("auth failed"))
		return
	}

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

	saltPassword := models.UserModel.EnsurePassword(body.SrcPassword)

	var obj models.User

	if err = models.Orm().QueryTable(obj.TableName()).Filter("user_id", body.UserId).Filter("password", saltPassword).One(&obj); err != nil {
		c.HandleBadRequest(utils.TriggerError("原密码有误!"))
		return
	}

	if err = obj.SetPassword(body.DstPassword); err != nil {
		c.HandleServerError(err)
		return
	}

	cache.DELETE(key)

	c.OperationAudit(body, "用户密码修改")
	c.SuccessResponse(body, &base.QueryParam{})
}

// @router /changeEmail [post]
func (c *UserController) PublicChangeEmail() {
	var body UserSecurityEmailUpdate
	var err error

	if !c.IsLogin() {
		c.HandleUnauthorized(utils.TriggerError("auth failed"))
		return
	}

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

	obj := models.UserModel.GetObject(body.UserId)

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

	c.OperationAudit(body, "用户邮箱修改")
	c.SuccessResponse(body, &base.QueryParam{})
}
