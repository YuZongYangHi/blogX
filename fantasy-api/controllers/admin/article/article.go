package article

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"fantasy-api/utils"
	"fmt"
	"k8s.io/klog"
	"strconv"
)

type Controller struct {
	base.AdminController
}

// @router /:id [get]
func (c *Controller) Get() {

	var err error
	var articleIntId int

	articleId := c.Ctx.Input.Param(":id")

	if articleId == "" {
		c.HandleBadRequest(utils.TriggerError("articleId not found"))
		return
	}

	if articleIntId, err = strconv.Atoi(articleId); err != nil {
		c.HandleBadRequest(err)
		return
	}

	article := &models.Article{
		Id: articleIntId,
	}

	if article, err = models.ArticleModel.Query(article, "id"); err != nil {
		c.HandleNotFound()
		return
	}

	models.Orm().LoadRelated(article, "Category")
	models.Orm().LoadRelated(article, "Tags")
	models.Orm().LoadRelated(article, "Author")

	c.SuccessResponse(article, &base.QueryParam{})
}

// @router / [get]
func (c *Controller) List() {
	articles := new([]models.Article)
	params, _ := c.QueryPage(models.ArticleModel.TableName(), articles)

	result := new([]models.Article)

	for _, item := range *articles {
		models.Orm().LoadRelated(&item, "Tags")
		*result = append(*result, item)
	}
	c.SuccessResponse(result, params)
}

// @router /saveDraft [post]
func (c *Controller) SaveDraft() {
	var Body DraftArticle
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &Body); err != nil {
		c.HandleBadRequest(err)
		return
	}

	Body.Author = c.CurrentUser().Username

	article := &models.Article{
		Id:      Body.ArticleId,
		Title:   Body.Title,
		Content: Body.Content,
		IsDraft: true,
		Author:  &models.Author{Name: Body.Author},
	}

	if err = models.ArticleModel.SaveDraft(article); err != nil {
		c.HandleBadRequest(err)
		return
	}

	c.SuccessResponse(article, &base.QueryParam{})
}

// @router / [post]
func (c *Controller) Post() {
	var data CreateArticleParams
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.HandleBadRequest(err)
		return
	}

	var tags []*models.Tag

	for _, tagId := range data.TagIds {
		tags = append(tags, &models.Tag{Id: tagId})
	}

	article := &models.Article{
		Id:         data.ArticleId,
		Title:      data.Title,
		Image:      data.Image,
		Content:    data.Content,
		IsTop:      data.IsTop,
		IsDraft:    false,
		IsOriginal: data.IsOriginal,
		Tags:       tags,
		Author:     &models.Author{Name: c.CurrentUser().Username},
		Category:   &models.Category{Id: data.CategoryId},
	}

	if data.ArticleId != 0 {
		article.Author = models.AuthorModel.QueryUserIdByName(article.Author.Name)
		_, err = models.ArticleModel.Update(article)
	} else {
		_, err = models.ArticleModel.Create(article)
	}

	m2m := models.Orm().QueryM2M(article, "Tags")

	nums, err := m2m.Clear()

	if err == nil {
		fmt.Println("Removed Tag Nums: ", nums)
	} else {
		fmt.Println("Removed Tag error", err.Error())
	}

	m2m.Add(tags)

	if err != nil {
		c.HandleBadRequest(err)
		return
	}

	c.SuccessResponse(article, &base.QueryParam{})
}

// @router /operation/ [post]
func (c *Controller) OperationController() {
	var Body OperationParams
	var err error

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &Body); err != nil {
		c.HandleBadRequest(err)
		return
	}

	var article models.Article

	orm := models.Orm().QueryTable(models.ArticleTableName)

	if err = orm.Filter("Id", Body.ArticleId).One(&article); err != nil {
		klog.Errorf(err.Error())
		c.HandleServerError(err)
		return
	}

	if Body.Action == "delete" {
		if _, err = article.Delete(); err != nil {
			klog.Errorf("delete article error: %s", err.Error())
			c.HandleServerError(err)
			return
		}
		c.SuccessResponse(nil, &base.QueryParam{})
		return
	}

	if _, err = article.OperationArticleByWhere(Body.Field, Body.Where); err != nil {
		klog.Errorf("article admin operation update filed error: %s", err.Error())
		c.HandleServerError(err)
		return
	}

	c.SuccessResponse(article, &base.QueryParam{})
}
