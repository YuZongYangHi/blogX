package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type Category struct {
	Id       int        `json:"id"`
	Name     string     `orm:"size(50); not null;unique" json:"name"`
	Articles []*Article `orm:"reverse(many)" json:"articles"`
	Created  time.Time  `orm:"auto_now_add;type(datetime)" json:"created"`
	Updated  time.Time  `orm:"auto_now;type(datetime)" json:"updated"`
}

func (*Category) TableName() string {
	return CategoryTableName
}

func (c *Category) Create(category *Category) (int64, error) {
	return Orm().Insert(category)
}

func (c *Category) GetObject(id int) (*Category, error) {
	var obj *Category
	return obj, Orm().QueryTable(c.TableName()).Filter("id", id).One(obj)
}

func (c *Category) Update(id int, name string) error {
	_, err := Orm().QueryTable(c.TableName()).Filter("id", id).Update(orm.Params{"name": name})
	return err
}
