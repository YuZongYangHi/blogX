package models

import "time"

type UserLogin struct {
	Id        int       `orm:"pk;auto" json:"id"`
	UserId    string    `json:"userId"`
	LoginName string    `json:"loginName"`
	Created   time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated   time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type UserOperationRecord struct {
	Id          int       `orm:"pk;auto" json:"id"`
	UserId      string    `json:"userId"`
	URL         string    `orm:"column(url);type(text)" json:"url"`
	Method      string    `json:"method"`
	Description string    `json:"description"`
	SrcData     string    `orm:"type(text)" json:"srcData"`
	DstData     string    `orm:"type(text)" json:"dstData"`
	Created     time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated     time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type AccessRecord struct {
	Id       int       `orm:"pk;auto" json:"id"`
	RemoteIp string    `json:"remoteIp"`
	URL      string    `orm:"column(url);type(text)" json:"url"`
	Method   string    `json:"method"`
	Created  time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated  time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type Blacklist struct {
	Id       int       `orm:"pk;auto" json:"id"`
	RemoteIp string    `json:"remoteIp"`
	Created  time.Time `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated  time.Time `orm:"auto_now;type(datetime)" json:"updated"`
}

type AddBlacklistParams struct {
	RemoteIp string `json:"remoteIp"`
}

func (*Blacklist) TableName() string {
	return "blacklist"
}

func (*AccessRecord) TableName() string {
	return "access_record"
}

func (*UserOperationRecord) TableName() string {
	return "user_operation_record"
}

func (*UserLogin) TableName() string {
	return "user_login_record"
}

func (*UserLogin) Add(userId, loginName string) error {
	obj := UserLogin{
		UserId:    userId,
		LoginName: loginName,
	}
	_, err := Orm().Insert(&obj)
	return err
}

func (*UserOperationRecord) Add(data *UserOperationRecord) error {
	_, err := Orm().Insert(data)
	return err
}

func (*AccessRecord) Add(data *AccessRecord) error {
	_, err := Orm().Insert(data)
	return err
}

func (c *Blacklist) Find(clientIp string) error {
	var obj Blacklist
	return Orm().QueryTable(c.TableName()).Filter("remoteIp", clientIp).One(&obj)
}

func (c *Blacklist) Search(clientIp string) (*Blacklist, error) {
	var blacklist Blacklist
	err := Orm().QueryTable(c.TableName()).Filter("remoteIp", clientIp).One(&blacklist)
	return &blacklist, err
}

func (c *Blacklist) Add(clientIp string) error {
	var err error

	if _, err = c.Search(clientIp); err != nil {
		_, err = Orm().Insert(&Blacklist{RemoteIp: clientIp})
		return err
	}
	return err
}
