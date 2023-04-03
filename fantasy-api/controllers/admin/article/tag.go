package article

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"github.com/astaxie/beego/orm"
	"k8s.io/klog"
	"strconv"
)

type TagController struct {
	base.AdminController
}

// @router / [get]
func (c *TagController) List() {
	tagList := new([]models.Tag)
	params, _ := c.QueryPage(models.TagModel.TableName(), tagList)
	c.SuccessResponse(tagList, params)
}

// @router /listLabels [get]
func (c *TagController) ListLabels() {

	var lists []*models.Tag
	var result []ListSearchLabels

	_, _ = models.Orm().QueryTable(models.TagTableName).Limit(1000).All(&lists)

	if len(lists) != 0 {
		for _, record := range lists {
			result = append(result, ListSearchLabels{
				Label: record.Name,
				Value: record.Id,
			})
		}
	}
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router / [post]
func (c *TagController) Post() {
	var data TagCategoryCreated
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	tag := &models.Tag{Name: data.Name}

	_, err = models.TagModel.Create(tag)

	if err != nil {
		klog.Errorf("create tag error -> %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(tag, &base.QueryParam{})
}

// @router /:id [put]
func (c *TagController) Put() {
	var tagId int
	var err error
	var data TagCategoryCreated

	Id := c.Ctx.Input.Param(":id")

	if tagId, err = strconv.Atoi(Id); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if err = models.TagModel.Update(tagId, data.Name); err != nil {
		klog.Errorf("tag created error -> %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /:id [delete]
func (c *TagController) Delete() {
	idStr := c.Ctx.Input.Param(":id")

	if id, err := strconv.Atoi(idStr); err != nil {
		c.HandleBadRequest(err)
		return
	} else {
		if _, err := models.Orm().QueryTable(models.TagTableName).Filter("id", id).Delete(); err != nil {
			c.HandleServerError(err)
			return
		}
	}

	c.SuccessResponse(orm.Params{"id": idStr}, &base.QueryParam{})

}
