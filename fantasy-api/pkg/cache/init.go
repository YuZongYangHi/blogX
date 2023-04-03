package cache

import (
	"fantasy-api/initial"
	"github.com/go-redis/redis"
)

var (
	Cursor redis.Cmdable
)

func init() {
	var err error

	if Cursor, err = initial.InitRedisDB(); err != nil {
		panic(err)
	}
}
