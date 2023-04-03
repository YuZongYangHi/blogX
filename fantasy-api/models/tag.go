package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type Tag struct {
	Id       int        `orm:"unique" json:"id"`
	Name     string     `json:"name"`
	Articles []*Article `orm:"reverse(many)" json:"articles"`
	Created  time.Time  `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated  time.Time  `orm:"auto_now;type(datetime)" json:"updated"`
}

func (*Tag) TableName() string {
	return TagTableName
}

func (c *Tag) Create(tag *Tag) (int64, error) {
	return Orm().Insert(tag)
}

func (c *Tag) GetObject(id int) (*Tag, error) {
	var obj *Tag
	return obj, Orm().QueryTable(c.TableName()).Filter("id", id).One(obj)
}

func (c *Tag) Update(id int, name string) error {
	_, err := Orm().QueryTable(c.TableName()).Filter("id", id).Update(orm.Params{"name": name})
	return err
}
