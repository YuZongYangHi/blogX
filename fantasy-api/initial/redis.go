package initial

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/go-redis/redis"
)

const (
	standAloneConnect = "stand-alone"
	ClusterConnect    = "cluster"
)

var (
	redisConnectType string
	redisHost        string
	redisPort        int
	redisPassword    string
)

func init() {
	redisConnectType = beego.AppConfig.String("redis_type")
	redisHost = beego.AppConfig.String("redis_host")
	redisPort, _ = beego.AppConfig.Int("redis_port")
	redisPassword = beego.AppConfig.String("redis_pass")
}

// 连接单机
func standAloneConnection() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisHost, redisPort),
		Password: redisPassword,
		DB:       7,
	})
}

// 连接集群
func clusterConnection() *redis.ClusterClient {
	return redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:    []string{fmt.Sprintf("%s:%d", redisHost, redisPort)},
		Password: redisPassword,
	})
}

func InitRedisDB() (r redis.Cmdable, err error) {
	switch redisConnectType {
	case standAloneConnect:
		r = standAloneConnection()
	case ClusterConnect:
		r = clusterConnection()
	default:
		panic("invalid redis connection mode, optional: stand-alone/cluster")
	}

	_, err = r.Ping().Result()

	return r, err
}
