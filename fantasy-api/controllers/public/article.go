package public

import (
	"encoding/json"
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"fantasy-api/utils"
	"github.com/astaxie/beego/context"
	"strconv"
)

type ArticleController struct {
	base.PublicController
}

func GetArticleId(ctx *context.Context) (int, error) {
	var err error
	var articleIntId int

	articleId := ctx.Input.Param(":id")

	if articleId == "" {
		return articleIntId, err
	}

	if articleIntId, err = strconv.Atoi(articleId); err != nil {
		return articleIntId, err
	}

	return articleIntId, err
}

// @router /topList [get]
func (c *ArticleController) ArticleTopList() {
	var result []ArticleTopList

	var lists []models.Article

	_, err := models.Orm().QueryTable(models.ArticleTableName).
		Filter("IsDraft", false).
		Filter("IsTop", true).
		OrderBy("-updated").
		RelatedSel().Limit(5).
		All(&lists)

	if err == nil {
		for _, item := range lists {
			result = append(result, ArticleTopList{
				Id:       item.Id,
				Title:    item.Title,
				Image:    item.Image,
				Category: item.Category.Name,
			})
		}
	}

	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /popular [get]
func (c *ArticleController) Popular() {
	var lists []models.Article
	_, _ = models.Orm().QueryTable(models.ArticleTableName).
		Filter("IsDraft", false).
		OrderBy("-viewNum").
		RelatedSel().
		Limit(5).
		All(&lists)
	c.SuccessResponse(lists, &base.QueryParam{})
}

// @router /tag/pool [get]
func (c *ArticleController) TagPool() {
	var result []models.Tag
	_, _ = models.Orm().QueryTable(models.TagTableName).OrderBy("created").Limit(1000).All(&result)
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /newest [get]
func (c *ArticleController) Newest() {
	var lists []models.Article
	_, _ = models.Orm().QueryTable(models.ArticleTableName).
		Filter("IsDraft", false).
		OrderBy("-created").
		RelatedSel().
		Limit(5).
		All(&lists)
	c.SuccessResponse(lists, &base.QueryParam{})
}

// @router /list [get]
func (c *ArticleController) List() {
	list := new([]models.Article)
	params, _ := c.QueryPage(models.ArticleTableName, list)

	result := new([]models.Article)
	for _, item := range *list {
		models.Orm().LoadRelated(&item, "Tags")
		*result = append(*result, item)
	}

	c.SuccessResponse(result, params)
}

// @router /detail/:id [get]
func (c *ArticleController) Detail() {

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

// @router /:id/autoView [get]
func (c *ArticleController) AutoView() {

	var err error
	var articleId int

	if articleId, err = GetArticleId(c.Ctx); err != nil {
		c.HandleBadRequest(err)
		return
	}

	var obj models.Article

	if err = models.Orm().QueryTable(models.ArticleTableName).Filter("id", articleId).One(&obj); err != nil {
		c.HandleNotFound()
		return
	}

	obj.ViewNum++

	if _, err := obj.Update(&obj, "viewNum"); err != nil {
		c.HandleServerError(err)
		return
	} else {
		c.SuccessResponse(obj, &base.QueryParam{})
		return
	}
}

// @router /like [post]
func (c *ArticleController) Like() {

	var data UserLikeArticle
	var err error

	if !c.IsLogin() {
		c.ErrorResponse(401, "请登录后在进行操作")
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	user := c.CurrentUser()

	if user == nil {
		c.ErrorResponse(401, "用户获取失败")
		return
	}

	var obj models.UserLikeArticle

	if err := models.Orm().QueryTable(models.UserLikeArticleModel.TableName()).Filter("user_id", data.UserId).Filter("article_id", data.ArticleId).One(&obj); err == nil {
		c.ErrorResponse(403, "你已点过该文章")
		return
	}

	if err = models.ArticleModel.LikeAuto(data.ArticleId); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	uk := models.UserLikeArticle{
		ArticleId: data.ArticleId,
		UserId:    data.UserId,
	}

	if err = models.UserLikeArticleModel.Insert(&uk); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}

	c.OperationAudit(&obj, "用户点赞")
	c.SuccessResponse(data, &base.QueryParam{})
}

// @router /:id/comments [get]
func (c *ArticleController) ArticleComments() {
	var articleId int
	var err error

	if articleId, err = GetArticleId(c.Ctx); err != nil {
		c.ErrorResponse(400, "articleId required number")
		return
	}

	if comments, err := models.CommentModel.List(articleId); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	} else {
		c.SuccessResponse(comments, &base.QueryParam{})
	}
}

// @router /newestComments [get]
func (c *ArticleController) NewestComments() {
	c.SuccessResponse(models.CommentModel.NewestComments(5), &base.QueryParam{})
}

// @router /comments [post]
func (c *ArticleController) AddComment() {
	var data models.AddCommentBody
	var err error

	if !c.IsLogin() {
		c.ErrorResponse(401, "请登录后在进行操作")
		return
	}

	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.ErrorResponse(400, "结构解析失败")
		return
	}

	if comment, err := models.CommentModel.AddComment(&data); err != nil {
		c.ErrorResponse(500, err.Error())
		return
	} else {
		c.OperationAudit(comment, "用户评论")
		c.SuccessResponse(comment, &base.QueryParam{})
	}
}
