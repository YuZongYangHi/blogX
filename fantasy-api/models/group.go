package models

import "time"

type Group struct {
	Id          int
	Name        string    `orm:"size(20);unique;column(name)"json:"name"`
	Users       []*Author `orm:"reverse(many)" json:"users"`
	CreateTime  time.Time `orm:"auto_now_add;type(datetime)" json:"createTime,omitempty"`
	UpdateTime  time.Time `orm:"auto_now;type(datetime)" json:"updateTime,omitempty"`
	Description string    `orm:"null"json:"description"`
}

func (*Group) TableName() string {
	return GroupTableName
}

func (*Group) Create(v *Group) (id int64, err error) {
	id, err = Orm().Insert(v)
	return id, err
}
