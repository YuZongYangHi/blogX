package public

import (
	"fantasy-api/controllers/base"
	"fantasy-api/models"
)

type CategoryController struct {
	base.PublicController
}

// @router /routers [get]
func (c *CategoryController) Routers() {
	var result []CategoryRouters
	categoryList := new([]models.Category)
	params, _ := c.QueryPage(models.CategoryModel.TableName(), categoryList)
	for _, i := range *categoryList {
		result = append(result, CategoryRouters{Name: i.Name, Id: i.Id})
	}
	c.SuccessResponse(result, params)
}
