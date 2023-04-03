package users

import (
	"fantasy-api/models"
	"fantasy-api/pkg/event"
	"fmt"
	"github.com/astaxie/beego"
	"k8s.io/klog"
)

func SendNoticeByEmail(subject string, userId, body string) error {
	user, err := models.AuthorModel.GetObjectById(userId)
	if err != nil {
		return err
	}

	return event.SendMailBy163([]string{user.Email}, subject, body)
}

func GetFollowerStateDisplay(data models.FollowersBody) string {
	action := ""
	switch data.Type {
	case 0:
		action = "取消关注"
	case 1:
		action = "关注"
	}
	return fmt.Sprintf("用户ID: %s 关注类型: %s", data.UserId, action)
}

func GetUserPrivateMessageStateDisplay(data models.PrivateMessageRequestBody) string {
	var article models.Article
	err := models.Orm().QueryTable(article.TableName()).Filter("id", data.ArticleId).RelatedSel().One(&article)
	if err != nil {
		return ""
	}

	tpl := fmt.Sprintf("<a href=%s/category/%s/article/%d>文章地址</a>", beego.AppConfig.String("host"), article.Category.Name, article.Id)

	body := fmt.Sprintf("用户ID: %s 关联地址: %s 私信内容: %s", data.UserId, tpl, data.Content)
	return body
}

func SendUserNoticeByEmail(subject string, userId, body string) error {
	user, err := models.UserModel.GetObjectById(userId)
	if err != nil {
		klog.Errorf(err.Error())
		return err
	}

	return event.SendMailBy163([]string{user.Email}, subject, body)
}

func PrivateMessageBodyFormat(data models.PrivateMessageRequestBody) string {
	var article models.Article
	err := models.Orm().QueryTable(article.TableName()).Filter("id", data.ArticleId).RelatedSel().One(&article)
	if err != nil {
		return ""
	}

	tpl := fmt.Sprintf("<a href=%s/category/%s/article/%d>文章地址</a>", beego.AppConfig.String("host"), article.Category.Name, article.Id)
	body := fmt.Sprintf("作者回复了您, 关联地址: %s", tpl)
	return body

}
