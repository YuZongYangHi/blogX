package models

import (
	"errors"
	"fantasy-api/utils"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"k8s.io/klog"
	"time"
)

type Author struct {
	UserId              string     `orm:"pk;not null;unique;size(100)" json:"userId"`
	Name                string     `orm:"index;unique;size(100)" json:"name"`
	Phone               int        `orm:"size(11)" json:"phone"`
	Password            string     `orm:"size(255)" json:"-"`
	Email               string     `orm:"size(50)" json:"email,omitempty"`
	Display             string     `orm:"size(50)" json:"display,omitempty"`
	Description         string     `orm:"null" json:"description"`
	IsAdmin             bool       `orm:"default(False)" json:"isAdmin"`
	Level               int        `json:"level"`
	IsGrant             bool       `json:"isGrant"`
	IsActive            bool       `orm:"default(True)" json:"isActive"`
	IsSuper             bool       `json:"isSuper"`
	City                string     `json:"city"`
	Followers           int        `json:"followers"`
	Avatar              string     `orm:"default(/golang-waitou.png)" json:"avatar"`
	LastLogin           *time.Time `orm:"auto_now_add;type(datetime)" json:"lastLogin,omitempty"`
	Gender              int        `json:"gender"`
	IsDeleted           bool       `orm:"default(false)" json:"IsDeleted,omitempty"`
	CreateTime          *time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime          *time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	Group               *Group     `orm:"rel(fk)" json:"group"`
	Articles            []*Article `orm:"reverse(many)" json:"articles"`
	IsLikeNotice        bool       `orm:"column(is_like_notice)" json:"isLikeNotice"`
	IsCommentNotice     bool       `orm:"column(is_comment_notice)" json:"isCommentNotice"`
	IsFollowNotice      bool       `orm:"column(is_follow_notice)" json:"isFollowNotice"`
	IsPrivateChatNotice bool       `orm:"column(is_private_chat_notice)" json:"isPrivateChatNotice"`
}

type FollowersBody struct {
	UserId   string `json:"userId"`
	AuthorId string `json:"authorId"`
	Type     int    `json:"type"`
}

type UserFollowers struct {
	Id       int    `orm:"column(id)" json:"id"`
	UserId   string `orm:"not null;size(100)" json:"userId"`
	AuthorId string `orm:"not null;size(100)" json:"authorId"`
}

func (*UserFollowers) TableName() string {
	return "user_follower"
}

func (u *UserFollowers) Change(data *FollowersBody) error {
	obj, err := u.Filter(data.UserId, data.AuthorId)

	switch data.Type {
	case 0:
		if err == nil {
			_, err = Orm().Delete(obj)
		}
	case 1:
		if err != nil {
			obj := UserFollowers{UserId: data.UserId, AuthorId: data.AuthorId}
			_, err = Orm().Insert(&obj)
		}
	}
	return err
}

func (u *UserFollowers) Filter(userId, authorId string) (*UserFollowers, error) {
	var obj UserFollowers
	err := Orm().QueryTable(u.TableName()).Filter("userId", userId).Filter("authorId", authorId).One(&obj)
	return &obj, err
}

type PrivateMessage struct {
	Id        int       `orm:"column(id)" json:"id"`
	UserId    string    `orm:"not null;size(100)" json:"userId"`
	AuthorId  string    `orm:"not null;size(100)" json:"authorId"`
	ArticleId int       `orm:"not null;column(article_id)" json:"articleId"`
	Type      int       `json:"type"`
	Content   string    `orm:"type(text)" json:"content"`
	Created   time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated   time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type PrivateMessageResponse struct {
	Id        int       `json:"id"`
	Author    string    `json:"author"`
	ArticleId int       `json:"articleId"`
	Avatar    string    `json:"avatar"`
	Content   string    `json:"content"`
	Created   time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Type      int       `json:"type"`
}

type PrivateMessageRequestBody struct {
	UserId    string `json:"userId"`
	ArticleId int    `json:"articleId"`
	AuthorId  string `json:"authorId"`
	Content   string `json:"content"`
	Type      int    `json:"type"`
}

type UserCommonInfo struct {
	UserId   string `json:"userId"`
	Username string `json:"username"`
	Display  string `json:"display"`
	Avatar   string `json:"avatar"`
}

type DialogueMessage struct {
	Id        int       `json:"id"`
	LoginName string    `json:"loginName"`
	NickName  string    `json:"nickName"`
	UserId    string    `json:"userId"`
	Avatar    string    `json:"avatar"`
	AuthorId  string    `json:"authorId"`
	ArticleId int       `json:"articleId"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
	Updated   time.Time `json:"updated"`
}

type DialogueDetailMessage struct {
	DialogueMessage
	Category string `json:"category"`
}

type DialogueDetailQueryParams struct {
	UserId    string `json:"userId"`
	AuthorId  string `json:"authorId"`
	ArticleId int    `json:"articleId"`
}

func (c *PrivateMessage) DialogueList(authorId string) ([]DialogueMessage, error) {
	var dialogue []PrivateMessage
	var result []DialogueMessage
	var err error

	_, err = Orm().QueryTable(c.TableName()).Filter("authorId", authorId).GroupBy("articleId", "userId").OrderBy("-Updated").All(&dialogue)

	if err != nil {
		return result, err
	}

	for _, option := range dialogue {
		var userInfo *User

		if userInfo, err = UserModel.QueryUserInfoById(option.UserId); err != nil {
			return result, err
		}

		result = append(result, DialogueMessage{
			Id:        option.Id,
			UserId:    userInfo.UserId,
			LoginName: userInfo.Name,
			NickName:  userInfo.Display,
			Avatar:    userInfo.Avatar,
			AuthorId:  authorId,
			ArticleId: option.ArticleId,
			Content:   option.Content,
			Created:   option.Created,
			Updated:   option.Updated,
		})
	}

	return result, nil
}

func (c *PrivateMessage) DialogueDetail(param *DialogueDetailQueryParams) ([]DialogueDetailMessage, error) {
	var dialogue []PrivateMessage
	var result []DialogueDetailMessage
	var err error

	_, err = Orm().
		QueryTable(c.TableName()).
		Filter("userId", param.UserId).
		Filter("authorId", param.AuthorId).
		Filter("articleId", param.ArticleId).
		OrderBy("created").All(&dialogue)

	if err != nil {
		klog.Errorf("model -> PrivateMessage -> Filter -> Err: %s", err.Error())
		return nil, err
	}

	for _, obj := range dialogue {

		var userInfo *User

		if userInfo, err = UserModel.QueryUserInfoById(obj.UserId); err != nil {
			klog.Errorf("model -> PrivateMessage -> DialogueDetail -> QueryUserInfoById -> Err: %s", err.Error())
			return result, err
		}

		origin := DialogueMessage{
			Id:        obj.Id,
			UserId:    userInfo.UserId,
			LoginName: userInfo.Name,
			NickName:  userInfo.Display,
			Avatar:    userInfo.Avatar,
			AuthorId:  param.AuthorId,
			ArticleId: obj.ArticleId,
			Content:   obj.Content,
			Created:   obj.Created,
			Updated:   obj.Updated,
		}

		if article, err := ArticleModel.GetObject(param.ArticleId); err != nil {
			return nil, err
		} else {
			result = append(result, DialogueDetailMessage{
				DialogueMessage: origin,
				Category:        article.Category.Name,
			})
		}
	}
	return []DialogueDetailMessage{}, nil
}

func (*PrivateMessage) TableName() string {
	return "private_message"
}

func (c *PrivateMessage) GetMessage(userId, authorId string, articleId int) ([]PrivateMessage, error) {
	var result []PrivateMessage
	var err error
	_, err = Orm().QueryTable(c.TableName()).Filter("userId", userId).
		Filter("authorId", authorId).
		Filter("articleId", articleId).
		OrderBy("created").
		All(&result)
	return result, err
}

func (c *PrivateMessage) GetAuthorInfo(userId string) UserCommonInfo {
	var user Author

	if err := Orm().QueryTable(AuthorModel.TableName()).Filter("userId", userId).One(&user); err == nil {
		return UserCommonInfo{UserId: user.UserId, Username: user.Name, Display: user.Display, Avatar: user.Avatar}
	}
	return UserCommonInfo{}
}

func (c *PrivateMessage) GetUserInfo(userId string) UserCommonInfo {
	var user User

	if err := Orm().QueryTable(UserModel.TableName()).Filter("userId", userId).One(&user); err == nil {
		return UserCommonInfo{UserId: user.UserId, Username: user.Name, Display: user.Display, Avatar: user.Avatar}
	}
	return UserCommonInfo{}
}

func (c *PrivateMessage) GetAuthorMessages(userId, authorId string, articleId int) []PrivateMessageResponse {
	var result []PrivateMessageResponse
	if list, err := c.GetMessage(userId, authorId, articleId); err == nil {
		for _, l := range list {

			obj := PrivateMessageResponse{
				Id:        l.Id,
				ArticleId: articleId,
				Content:   l.Content,
				Type:      l.Type,
			}

			var user UserCommonInfo

			switch l.Type {
			case 0:
				user = c.GetUserInfo(userId)

			case 1:
				user = c.GetAuthorInfo(authorId)
			}

			username := user.Display

			if username == "" {
				username = user.Username
			}

			obj.Author = user.Username
			obj.Avatar = user.Avatar
			obj.Created = l.Created

			result = append(result, obj)
		}
	}
	return result
}

func (c *PrivateMessage) AddMessage(data *PrivateMessageRequestBody) error {
	obj := PrivateMessage{
		UserId:    data.UserId,
		AuthorId:  data.AuthorId,
		ArticleId: data.ArticleId,
		Type:      data.Type,
		Content:   data.Content,
	}
	_, err := Orm().Insert(&obj)
	return err
}

func (*Author) TableName() string {
	return AuthorTableName
}

func (*Author) Create(v *Author) (id int64, err error) {
	v.Password = v.EnsurePassword(v.Password)
	v.UserId = utils.GenerateUUID()
	return Orm().Insert(v)
}

func (*Author) EnsurePassword(rawPassword string) string {
	salt := beego.AppConfig.String("account_salt")
	return utils.MD5Encode(fmt.Sprintf("%s%s", salt, rawPassword))
}

func (*Author) Query(user *Author, col ...string) (*Author, error) {
	return user, Orm().Read(user, col...)
}

func (*Author) QueryUserIdByName(name string) *Author {
	user := &Author{Name: name}
	_ = Orm().Read(user, "name")
	return user
}

func (u *Author) CheckAdminLogin(username, rawPassword string) (*Author, error) {

	user := Author{
		Name:     username,
		Password: u.EnsurePassword(rawPassword),
	}

	if err := Orm().Read(&user, "name", "password"); err == nil {

		if !user.IsAdmin {
			return nil, errors.New("您没有权限登录后台")
		}

		if !user.IsActive {
			return nil, errors.New("该用户已被限制登录")
		}

		if _, err := Orm().Update(&user); err != nil {
			klog.Errorf("update user last login time error: %s, user: %s", err.Error(), username)
			return nil, errors.New(err.Error())
		}
		return &user, nil
	}

	return nil, errors.New("用户名或密码有误")
}

func (u *Author) QueryUserInfoByName(name string) (*Author, error) {
	var result Author
	var err error
	err = Orm().QueryTable(AuthorTableName).Filter("name", name).RelatedSel().One(&result)
	return &result, err
}

func (u *Author) GetObject(userId string) orm.QuerySeter {
	return Orm().QueryTable(u.TableName()).Filter("user_id", userId)
}

func (u *Author) SetPassword(newPassword string) error {
	saltPassword := u.EnsurePassword(newPassword)
	u.Password = saltPassword
	_, err := Orm().Update(u, "password")
	return err
}

func (u *Author) GetObjectById(authorId string) (*Author, error) {
	var author Author
	err := Orm().QueryTable(u.TableName()).Filter("userId", authorId).One(&author)
	return &author, err
}

func (u *Author) IsFollowersNotice(authorId string) bool {
	author, _ := u.GetObjectById(authorId)
	return author.IsFollowNotice
}

func (u *Author) IsArticleLikeNotice(authorId string) bool {
	author, _ := u.GetObjectById(authorId)
	return author.IsLikeNotice
}

func (u *Author) IsArticleCommentNotice(authorId string) bool {
	author, _ := u.GetObjectById(authorId)
	return author.IsCommentNotice
}

func (u *Author) IsPrivateMessageNotice(authorId string) bool {
	author, _ := u.GetObjectById(authorId)
	return author.IsPrivateChatNotice
}
