package audit

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
)

type Controller struct {
	base.AdminController
}

// @router /users [get]
func (c *Controller) Users() {
	result := new([]models.User)
	params, _ := c.QueryPage(models.UserModel.TableName(), result)
	c.SuccessResponse(result, params)
}

// @router /users/allowLogin [post]
func (c *Controller) AllowLogin() {
	var data models.UserAllowLoginParams
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if err = models.UserModel.SetUserLogin(&data); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}
	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /users/login
func (c *Controller) Login() {
	result := new([]models.UserLogin)
	params, _ := c.QueryPage(models.UserLoginModel.TableName(), result)
	c.SuccessResponse(result, params)
}

// @router /users/operation [get]
func (c *Controller) Operation() {
	result := new([]models.UserOperationRecord)
	params, _ := c.QueryPage(models.UserOperationRecordModel.TableName(), result)
	c.SuccessResponse(result, params)
}

// @router /users/access [get]
func (c *Controller) Access() {
	result := new([]models.AccessRecord)
	params, _ := c.QueryPage(models.AccessRecordModel.TableName(), result)
	c.SuccessResponse(result, params)
}

// @router /users/blacklist [get]
func (c *Controller) Blacklist() {
	result := new([]models.Blacklist)
	params, _ := c.QueryPage(models.BlacklistModel.TableName(), result)
	c.SuccessResponse(result, params)
}

// @router /users/blacklist [post]
func (c *Controller) AddBlacklist() {
	var data models.AddBlacklistParams
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if err = models.BlacklistModel.Add(data.RemoteIp); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}
	
	c.SuccessResponse(data, &base.QueryParam{})
}
