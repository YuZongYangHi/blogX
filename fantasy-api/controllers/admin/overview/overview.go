package overview

import (
	"fantasy-api/controllers/base"
	"fantasy-api/models"
	"fantasy-api/utils"
	"fmt"
)

type Controller struct {
	base.AdminController
}

type ArticleOverviewResponse struct {
	ArticleNum  int64 `json:"articleNum"`
	OriginNum   int64 `json:"originNum"`
	CategoryNum int64 `json:"categoryNum"`
	TagNum      int64 `json:"tagNum"`
}

type UserOverviewResponse struct {
	UserNum           int64 `json:"userNum"`
	LikeNum           int64 `json:"likeNum"`
	CommentNum        int64 `json:"commentNum"`
	PrivateMessageNum int64 `json:"privateMessageNum"`
}

type TrendCommonTrend struct {
	Date   string `json:"date"`
	Scales int64  `json:"scales"`
}

// @router /article [get]
func (c *Controller) ArticleOverview() {
	result := &ArticleOverviewResponse{}
	var err error

	result.ArticleNum, err = models.Orm().QueryTable(models.ArticleModel.TableName()).Count()
	result.OriginNum, err = models.Orm().QueryTable(models.ArticleModel.TableName()).Filter("isOriginal", true).Count()
	result.CategoryNum, err = models.Orm().QueryTable(models.CategoryModel.TableName()).Count()
	result.TagNum, err = models.Orm().QueryTable(models.TagModel.TableName()).Count()

	if err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}
	c.SuccessResponse(result, &base.QueryParam{})
}

// @router /user [get]
func (c *Controller) UserOverview() {
	result := &UserOverviewResponse{}
	var err error

	result.UserNum, err = models.Orm().QueryTable(models.UserModel.TableName()).Count()
	result.LikeNum, err = models.Orm().QueryTable(models.UserLikeArticleModel.TableName()).Count()
	result.CommentNum, err = models.Orm().QueryTable(models.CommentModel.TableName()).Count()
	result.PrivateMessageNum, err = models.Orm().QueryTable(models.PrivateMessageModel.TableName()).Count()

	if err != nil {
		c.ErrorResponse(500, err.Error())
		return
	}
	c.SuccessResponse(result, &base.QueryParam{})
}

func (c *Controller) GetWhatInstanceTrend(table string) []TrendCommonTrend {
	var result []TrendCommonTrend

	timeList := utils.GetRecent7timeList()

	for _, datetime := range timeList {
		count, _ := models.Orm().QueryTable(table).Filter("created__gte", datetime).Filter("created__lte", fmt.Sprintf("%s 23:59:59", datetime)).Count()
		result = append(result, TrendCommonTrend{
			Date:   datetime,
			Scales: count,
		})
	}
	return result
}

// @router /userLoginTrend
func (c *Controller) UserLoginTrend() {
	c.SuccessResponse(c.GetWhatInstanceTrend(models.UserLoginModel.TableName()), &base.QueryParam{})
}

// @router /articleReleaseTrend
func (c *Controller) ArticleReleaseTrend() {
	c.SuccessResponse(c.GetWhatInstanceTrend(models.ArticleModel.TableName()), &base.QueryParam{})
}
