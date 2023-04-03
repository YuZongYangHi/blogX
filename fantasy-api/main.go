package main

import (
	_ "fantasy-api/routers"
	"github.com/astaxie/beego"
	_ "github.com/astaxie/beego/session/redis"
	_ "github.com/go-redis/redis"
)

func main() {

	beego.Run()
}
