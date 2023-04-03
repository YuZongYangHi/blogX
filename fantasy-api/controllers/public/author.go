package public

import (
	"encoding/json"
	"fantasy-api/controllers/admin/users"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"k8s.io/klog"
	"strconv"
)

type AuthorController struct {
	base.PublicController
}

// @router /followers [post]
func (c *AuthorController) Followers() {

	var err error

	if !c.IsLogin() {
		c.ErrorResponse(401, "未登录")
		return
	}

	var data models.FollowersBody

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if err = models.UserFollowerModel.Change(&data); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	if err = users.SendNoticeByEmail("用户关注通知", data.AuthorId, users.GetFollowerStateDisplay(data)); err != nil {
		klog.Errorf(err.Error())
	}

	c.OperationAudit(data, "用户关注")
	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /followers [get]
func (c *AuthorController) GetFollowers() {

	var result *models.UserFollowers
	var err error

	userId := c.Ctx.Input.Query("userId")
	authorId := c.Ctx.Input.Query("authorId")

	if userId == "" || authorId == "" {
		c.ErrorResponse(400, "参数有误")
		return
	}

	if result, err = models.UserFollowerModel.Filter(userId, authorId); err != nil {
		c.ErrorResponse(404, err.Error())
		return
	}
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /message [get]
func (c *AuthorController) ListMessage() {
	if !c.IsLogin() {
		c.ErrorResponse(401, "未登录")
		return
	}

	var articleId int
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

	result := models.PrivateMessageModel.GetAuthorMessages(userId, authorId, articleId)
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /message [post]
func (c *AuthorController) SendMessage() {
	var data models.PrivateMessageRequestBody
	var err error

	if !c.IsLogin() {
		c.ErrorResponse(401, "未登录")
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if err = models.PrivateMessageModel.AddMessage(&data); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	if ok := models.AuthorModel.IsPrivateMessageNotice(data.AuthorId); ok {
		users.SendNoticeByEmail("用户私信通知", data.AuthorId, users.GetUserPrivateMessageStateDisplay(data))
	}

	c.OperationAudit(data, "用户私信")
	c.SuccessResponse(data, &base.QueryParam{})
}
