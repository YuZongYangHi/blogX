package models

import (
	"fantasy-api/initial"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
	"sync"
)

var (
	globalOrm orm.Ormer
	once      sync.Once
)

func init() {

	// set default database
	if err := initial.InitDb(); err != nil {
		panic(err)
	}

	// register model
	orm.RegisterModel(
		new(Group),
		new(Author),
		new(User),
		new(URLFrequencyLimit),
		new(URLWhitelist),
		new(Category),
		new(Tag),
		new(Comment),
		new(Article),
		new(UserLikeArticle),
		new(UserFollowers),
		new(PrivateMessage),
		new(UserLogin),
		new(UserOperationRecord),
		new(AccessRecord),
		new(Blacklist),
	)

	// table sync
	// create table
	if err := orm.RunSyncdb("default", false, true); err != nil {
		panic(err)
	}
}

func Orm() orm.Ormer {
	once.Do(func() {
		globalOrm = orm.NewOrm()
	})
	return globalOrm
}
