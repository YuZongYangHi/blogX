package article

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"github.com/astaxie/beego/orm"
	"k8s.io/klog"
	"strconv"
)

type CategoryController struct {
	base.AdminController
}

// @router / [get]
func (c *CategoryController) List() {
	categoryList := new([]models.Category)
	params, _ := c.QueryPage(models.CategoryModel.TableName(), categoryList)
	c.SuccessResponse(categoryList, params)
}

// @router /listLabels [get]
func (c *CategoryController) ListLabels() {

	var lists []*models.Category
	var result []ListSearchLabels

	_, _ = models.Orm().QueryTable(models.CategoryTableName).Limit(1000).All(&lists)

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
func (c *CategoryController) Post() {
	var data TagCategoryCreated
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	category := &models.Category{Name: data.Name}

	_, err = models.CategoryModel.Create(category)

	if err != nil {
		klog.Errorf("create category error -> %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(category, &base.QueryParam{})
}

// @router /:id [put]
func (c *CategoryController) Put() {
	var categoryId int
	var err error
	var data TagCategoryCreated

	Id := c.Ctx.Input.Param(":id")

	if categoryId, err = strconv.Atoi(Id); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	if err = models.CategoryModel.Update(categoryId, data.Name); err != nil {
		klog.Errorf("category created error -> %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /:id [delete]
func (c *CategoryController) Delete() {
	idStr := c.Ctx.Input.Param(":id")

	if id, err := strconv.Atoi(idStr); err != nil {
		c.HandleBadRequest(err)
		return
	} else {
		if _, err := models.Orm().QueryTable(models.CategoryTableName).Filter("id", id).Delete(); err != nil {
			c.HandleServerError(err)
			return
		}
	}

	c.SuccessResponse(orm.Params{"id": idStr}, &base.QueryParam{})

}