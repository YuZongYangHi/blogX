package models

import (
	"errors"
	"fantasy-api/utils"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"time"
)

type User struct {
	UserId      string    `orm:"pk;not null;unique;size(100)" json:"userId"`
	Name        string    `orm:"index;unique;size(100)" json:"name"`
	Password    string    `orm:"size(255)" json:"-"`
	Email       string    `orm:"index;unique;size(50)" json:"email,omitempty"`
	Display     string    `orm:"size(50)" json:"display,omitempty"`
	Description string    `orm:"null" json:"description"`
	Avatar      string    `orm:"default(/golang-waitou.png)" json:"avatar"`
	Gender      int       `json:"gender"`
	Interest    string    `orm:"size(255)" json:"interest"`
	IsActive    bool      `json:"is_active"`
	LastLogin   time.Time `orm:"auto_now_add;type(datetime)" json:"lastLogin,omitempty"`
	IsDeleted   bool      `orm:"default(false)" json:"IsDeleted,omitempty"`
	Created     time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated     time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type UserAllowLoginParams struct {
	AllowLogin int    `json:"allowLogin"`
	UserId     string `json:"userId"`
}

func (*User) TableName() string {
	return UserTableName
}

func (*User) EnsurePassword(rawPassword string) string {
	salt := beego.AppConfig.String("public_account_salt")
	return utils.MD5Encode(fmt.Sprintf("%s%s", salt, rawPassword))
}

func (u *User) Login(username, rawPassword string) (*User, error) {
	var user User

	if err := Orm().QueryTable(u.TableName()).Filter("name", username).Filter("password", u.EnsurePassword(rawPassword)).One(&user); err == nil {
		if !user.IsActive {
			return nil, errors.New("当前用户尚未激活")
		}

		if user.IsDeleted {
			return nil, errors.New("当前用户已注销")
		}
		return &user, nil
	}

	return nil, errors.New("用户名或密码有误")
}

func (u *User) UserIsExist(userId string) bool {
	var obj User
	err := Orm().QueryTable(u.TableName()).Filter("name", userId).One(&obj)

	if err == nil {
		return true
	}
	return false
}

func (u *User) Register(username, password, email string) (*User, error) {
	user := &User{
		UserId:   utils.GenerateUUID(),
		Name:     username,
		Password: u.EnsurePassword(password),
		Email:    email,
		Avatar:   "/golang-waitou.png",
	}

	if _, err := Orm().Insert(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (u *User) ActivationUser(userId string) error {

	if _, err := Orm().QueryTable(u.TableName()).Filter("user_id", userId).Update(orm.Params{"is_active": true}); err != nil {
		return err
	}
	return nil
}

func (u *User) QueryUserInfoById(userId string) (*User, error) {
	var user User
	err := Orm().QueryTable(u.TableName()).Filter("user_id", userId).One(&user)
	return &user, err
}

func (u *User) EmailIsExist(email string) bool {
	var obj User
	err := Orm().QueryTable(u.TableName()).Filter("email", email).One(&obj)

	if err == nil {
		return true
	}
	return false
}

func (u *User) ResetPassword(email, newPassword string) error {
	var user User
	if err := Orm().QueryTable(u.TableName()).Filter("email", email).One(&user); err != nil {
		return err
	}

	if user.Password == u.EnsurePassword(newPassword) {
		return utils.TriggerError("旧密码与新密码相同")
	}

	_, err := Orm().QueryTable(u.TableName()).Filter("email", email).Update(orm.Params{"password": u.EnsurePassword(newPassword)})
	return err
}

func (u *User) UpdateBasicInfo(userId string, values orm.Params) error {
	_, err := Orm().QueryTable(u.TableName()).Filter("user_id", userId).Update(values)
	return err
}

func (u *User) SetPassword(newPassword string) error {
	saltPassword := u.EnsurePassword(newPassword)
	u.Password = saltPassword
	_, err := Orm().Update(u, "password")
	return err
}

func (u *User) GetObject(userId string) orm.QuerySeter {
	return Orm().QueryTable(u.TableName()).Filter("user_id", userId)
}

func (u *User) SetUserLogin(data *UserAllowLoginParams) error {
	isLogin := false

	if data.AllowLogin == 1 {
		isLogin = true
	}

	_, err := Orm().QueryTable(u.TableName()).Filter("userId", data.UserId).Update(orm.Params{"IsActive": isLogin})
	return err
}

func (u *User) GetObjectById(userId string) (*User, error) {
	var user User
	var err error
	err = Orm().QueryTable(u.TableName()).Filter("userId", userId).One(&user)
	return &user, err
}