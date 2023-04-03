package cache

import "time"

func GET(key string) (string, error) {
	return Cursor.Get(key).Result()
}

func SET(key string, value interface{}, expiration time.Duration) (string, error) {
	return Cursor.Set(key, value, expiration).Result()
}

func DELETE(key string) (int64, error) {
	return Cursor.Del(key).Result()
}

func AutoIncr(key string) (int64, error) {
	return Cursor.Incr(key).Result()
}
