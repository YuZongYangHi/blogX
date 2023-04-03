package models

import "time"

type CommentList struct {
	Id        int       `json:"id"`
	UserId    string    `json:"userId"`
	Username  string    `json:"username"`
	Avatar    string    `json:"avatar"`
	Display   string    `json:"display"`
	ArticleId int       `json:"articleId"`
	Comment   string    `json:"comment"`
	Created   time.Time `orm:"auto_now_add;type(datetime)"`
	Updated   time.Time `orm:"auto_now;type(datetime)"`
}
type Comment struct {
	Id        int       `json:"id"`
	UserId    string    `orm:"size(50)" json:"user"`
	Content   string    `orm:"type(text); not null" json:"content"`
	ArticleId int       `orm:"column(article_id)" json:"articleId"`
	LikeNum   int       `json:"likeNum"`
	IsAuthor  bool      `json:"is_author"`
	Created   time.Time `orm:"auto_now_add;type(datetime)"`
	Updated   time.Time `orm:"auto_now;type(datetime)"`
}

type AddCommentBody struct {
	UserId    string `json:"userId"`
	Comment   string `json:"comment"`
	ArticleId int    `json:"articleId"`
}

func (*Comment) TableName() string {
	return CommentTableName
}

func (c *Comment) List(articleId int) ([]CommentList, error) {
	var comments []Comment
	var list []CommentList
	_, err := Orm().QueryTable(c.TableName()).Filter("article_id", articleId).OrderBy("-Created").All(&comments)

	if err == nil {
		list = c.Display(comments)
	}
	return list, err
}

func (c *Comment) NewestComments(limit int) []CommentList {
	var list []CommentList
	var result []Comment
	_, err := Orm().QueryTable(c.TableName()).OrderBy("-created").Limit(limit).All(&result)

	if err == nil {
		return c.Display(result)
	}

	return list
}
func (c *Comment) Display(comments []Comment) []CommentList {
	var list []CommentList
	for _, obj := range comments {
		comment := CommentList{
			Id:        obj.Id,
			UserId:    obj.UserId,
			ArticleId: obj.ArticleId,
			Comment:   obj.Content,
			Created:   obj.Created,
			Updated:   obj.Updated,
		}

		var user User
		if err := Orm().QueryTable(UserModel.TableName()).Filter("user_id", obj.UserId).One(&user); err != nil {
			continue
		}
		comment.Username = user.Name
		comment.Display = user.Display
		comment.Avatar = user.Avatar
		list = append(list, comment)
	}
	return list
}

func (c *Comment) AddComment(data *AddCommentBody) (*Comment, error) {

	comment := Comment{
		UserId:    data.UserId,
		Content:   data.Comment,
		ArticleId: data.ArticleId,
	}
	if _, err := Orm().Insert(&comment); err != nil {
		return nil, err
	}

	return &comment, nil
}
