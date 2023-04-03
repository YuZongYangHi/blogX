package initial

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

func parserDbFormat() string {
	dbUser := beego.AppConfig.String("db_user")
	dbPassword := beego.AppConfig.String("db_password")
	dbHost := beego.AppConfig.String("db_host")
	dbDatabase := beego.AppConfig.String("db_database")
	dbPort, _ := beego.AppConfig.Int("db_port")
	dbLoc := beego.AppConfig.String("dB_loc")
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&&loc=%s", dbUser, dbPassword, dbHost, dbPort, dbDatabase, dbLoc)
}

func InitDb() error {
	dbMaxIdle, _ := beego.AppConfig.Int("db_max_idle")
	dbMaxConn, _ := beego.AppConfig.Int("db_max_conn")

	return orm.RegisterDataBase("default", "mysql", parserDbFormat(), dbMaxIdle, dbMaxConn)
}
