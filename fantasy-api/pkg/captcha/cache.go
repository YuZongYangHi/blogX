package captcha

import (
	"errors"
	"fantasy-api/pkg/cache"
	"fantasy-api/utils"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"k8s.io/klog"
	"strconv"
)

const (
	// UserCaptchaCacheKey captcha cache key
	UserCaptchaCacheKey = "user_captcha_%s_by_%s"
	UserEmailCaptchaKey = "user_email_%s_captcha"
)

var (
	captchaLength  int
	captchaExpired string
)

func init() {
	captchaLength, _ = beego.AppConfig.Int("captcha_length")
	captchaExpired = beego.AppConfig.String("captcha_expire_date")
}

type UserAccessURIInfo struct {
	ClientIP string `json:"client_ip"`
	URI      string `json:"uri"`
	Expired  string `json:"expired"`
	MaxCount int64  `json:"max_count"`
}

func parserCacheKey(c UserAccessURIInfo) string {
	return fmt.Sprintf(UserCaptchaCacheKey, c.ClientIP, c.URI)
}

func QueryCaptchaCacheCount(r UserAccessURIInfo) (int64, error) {

	if s, err := cache.GET(parserCacheKey(r)); err != nil {
		return 0, err
	} else {
		n, _ := strconv.ParseInt(s, 10, 64)
		return n, nil
	}
}

func createUserLimitCache(r UserAccessURIInfo) (string, error) {
	return cache.SET(parserCacheKey(r), 1, utils.TimeGranularityConversion(r.Expired))
}

func increUserLimitCache(r UserAccessURIInfo) error {
	if _, err := cache.AutoIncr(parserCacheKey(r)); err != nil {
		return err
	}
	return nil
}

func SetIncr(key string) error {
	cache.AutoIncr(key)
	return nil
}

func GetIncr(key string) (int64, error) {
	if s, err := cache.GET(key); err != nil {
		return 0, err
	} else {
		n, _ := strconv.ParseInt(s, 10, 64)
		return n, nil
	}
}

func GetCaptchaByCache(r UserAccessURIInfo) ([]byte, error) {
	var err error
	var text string
	var count int64

	if count, err = QueryCaptchaCacheCount(r); err == nil {
		if count == r.MaxCount {
			logs.Warn("client_ip: %s, request_uri: %s the number of requests reached the limit", r.ClientIP, r.URI)
			return ImgText(GarbledText()), errors.New("the number of requests reached the limit")
		}
		err = increUserLimitCache(r)
	} else {
		_, err = createUserLimitCache(r)
	}

	text = GetRandStr(captchaLength)

	klog.Infof("user captcha: %s", text)

	_, err = cache.SET(text, 0, utils.TimeGranularityConversion(captchaExpired))
	return ImgText(text), err
}

func IsValid(text string) bool {
	val, _ := cache.GET(text)
	if len(val) == 0 {
		return false
	}

	cache.DELETE(text)
	return true
}
