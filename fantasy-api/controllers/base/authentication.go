package base

import (
	"fantasy-api/models"
	"fantasy-api/pkg/jwt"
	"fantasy-api/utils"
)

type AdminController struct {
	Controller
}

type PublicController struct {
	Controller
}

// Prepare 后台用户鉴权逻辑
func (c *AdminController) Prepare() {
	if c.IsReleaseURL() {
		return
	}

	// 黑名单验证
	if err := models.BlacklistModel.Find(c.GetClientIp()); err == nil {
		c.HandleForbidden()
		return
	}

	token := c.Ctx.Request.Header.Get("Authorization")

	if len(token) == 0 {
		c.HandleUnauthorized(utils.TriggerError("未找到token"))
		return
	}

	if _, err := jwt.Authentication(token); err != nil {
		c.HandleUnauthorized(utils.TriggerError("验证失败"))
		return
	}
}

// Prepare 前台用户鉴权逻辑
func (c *PublicController) Prepare() {

	// 黑名单验证
	if err := models.BlacklistModel.Find(c.GetClientIp()); err == nil {
		c.HandleForbidden()
		return
	}

	// 记录请求日志
	c.AccessRequestAutoRecord()

	if c.IsReleaseURL() {
		return
	}

}
func (c *ParamsBuildController) CurrentUser() *jwt.UserClaims {
	token := c.Ctx.Request.Header.Get("Authorization")
	claims, _ := jwt.Authentication(token)
	return &claims.UserClaims
}

func (c *PublicController) IsLogin() bool {
	userId := c.GetSession("userId")

	if userId == nil {
		c.HandleUnauthorized(utils.TriggerError("auth failed"))
		return false
	}

	if _, err := models.UserModel.QueryUserInfoById(userId.(string)); err != nil {
		return false
	}
	return true
}

func (c *PublicController) CurrentUser() *models.User {
	userId := c.GetSession("userId")

	if userId == nil {
		return nil
	}

	if user, err := models.UserModel.QueryUserInfoById(userId.(string)); err == nil {
		return user
	}
	return nil
}
