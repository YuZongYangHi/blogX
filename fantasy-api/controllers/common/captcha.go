package common

import (
	"fantasy-api/models"
	"fantasy-api/pkg/captcha"
	"github.com/astaxie/beego"
	"k8s.io/klog"
	"net/http"
	"strings"
)

type CaptchaController struct {
	beego.Controller
}

// @router /captcha?:seed [get]
func (t *CaptchaController) GetCaptcha() {

	UriLimit := captcha.UserAccessURIInfo{
		ClientIP: t.Ctx.Request.RemoteAddr,
		URI:      strings.Split(t.Ctx.Request.RequestURI, "?")[0],
	}

	var img []byte

	status := http.StatusOK

	if rLimit, err := models.URLFrequencyLimitModel.QueryRecordByURI(UriLimit.URI); err == nil {
		UriLimit.Expired = rLimit.Expired
		UriLimit.MaxCount = rLimit.MaximumVisit

		if img, err = captcha.GetCaptchaByCache(UriLimit); err != nil {
			klog.Errorf("get user captcha error: %s", err.Error())
			status = http.StatusForbidden
		}
	} else {
		klog.Errorf("user captcha trigger limit: %s", err.Error())
	}

	t.Ctx.Output.SetStatus(status)
	t.Ctx.Output.ContentType("png")
	t.Ctx.Output.Body(img)
}
