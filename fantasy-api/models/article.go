package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type Article struct {
	Id                int       `orm:"pk;auto" json:"Id"`
	Title             string    `orm:"size(50);not null" json:"title"`
	Image             string    `orm:"type(text); not null" json:"image"`
	Content           string    `orm:"type(text)" json:"content"`
	ViewNum           int       `orm:"column(view_num)" json:"viewNum"`
	LikeNum           int       `orm:"column(like_num)" json:"likeNum"`
	IsTop             bool      `orm:"column(is_top)" json:"isTop"`
	IsDraft           bool      `orm:"column(is_draft)" json:"isDraft"`
	IsOriginal        bool      `orm:"column(is_original)" json:"isOriginal"`
	IsDeleted         bool      `orm:"column(is_deleted)" json:"isDeleted"`
	Tags              []*Tag    `orm:"rel(m2m)" json:"tags"`
	IsDisabledComment bool      `orm:"column(is_disabled_comment" json:"isDisabledComment"`
	Author            *Author   `orm:"not null;rel(fk);size(100)" json:"author"`
	Category          *Category `orm:"null;rel(fk)" json:"category"`
	Created           time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated           time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type UserLikeArticle struct {
	Id        int       `orm:"pk;auto" json:"id"`
	UserId    string    `orm:"column(user_id)" json:"userId"`
	ArticleId int       `orm:"column(article_id)" json:"articleId"`
	Created   time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated   time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

func (t *UserLikeArticle) TableName() string {
	return "user_like_article"
}

func (t *UserLikeArticle) Insert(value *UserLikeArticle) error {
	_, err := Orm().Insert(value)
	return err
}

func (t *Article) TableName() string {
	return ArticleTableName
}

func (t *Article) Delete() (int64, error) {
	t.M2mRelatedDelete()
	t.commentRelatedDelete(t.Id)
	t.messageRelatedDelete(t.Id)
	return Orm().QueryTable(t.TableName()).Filter("Id", t.Id).Delete()
}

func (t *Article) commentRelatedDelete(articleId int) {
	Orm().QueryTable(CommentModel.TableName()).Filter("article_id", articleId).Delete()
}

func (t *Article) messageRelatedDelete(articleId int) {
	Orm().QueryTable(PrivateMessageModel.TableName()).Filter("article_id", articleId).Delete()
}

func (t *Article) M2mRelatedDelete() {
	Orm().QueryTable("article_tags").Filter("article_id", t.Id).Delete()
}

func (t *Article) OperationArticleByWhere(field string, where bool) (int64, error) {
	return Orm().QueryTable(t.TableName()).Filter("Id", t.Id).Update(orm.Params{field: where})
}

func (t *Article) Query(article *Article, col ...string) (*Article, error) {
	return article, Orm().Read(article, col...)
}

func (t *Article) Create(article *Article) (int64, error) {
	if author, err := AuthorModel.Query(article.Author, "name"); err != nil {
		return 0, err
	} else {
		article.Author = author
	}

	return Orm().Insert(article)
}

func (t *Article) Update(article *Article, col ...string) (int64, error) {
	return Orm().Update(article, col...)
}

func (t *Article) SaveDraft(article *Article) error {
	src := Article{
		Title:   article.Title,
		Content: article.Content,
	}
	if _, err := t.Query(article, "id"); err == nil {
		article.Title = src.Title
		article.Content = src.Content
		article.IsDraft = true
		_, err := t.Update(article, "is_draft", "title", "content", "author")
		return err
	}
	_, err := t.Create(article)
	return err
}

func (t *Article) LikeAuto(articleId int) error {
	var obj Article

	if err := Orm().QueryTable(t.TableName()).Filter("id", articleId).One(&obj); err == nil {
		likeCount := obj.LikeNum
		likeCount++
		obj.LikeNum = likeCount
		_, err := Orm().Update(&obj, "likeNum")
		return err
	} else {
		return err
	}
}

func (t *Article) GetObject(id int) (*Article, error) {

	var obj Article
	err := Orm().QueryTable(t.TableName()).Filter("id", id).RelatedSel().One(&obj)
	return &obj, err
}
