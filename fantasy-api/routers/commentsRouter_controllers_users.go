package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/users:CaptchaController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/users:CaptchaController"],
        beego.ControllerComments{
            Method: "GetCaptcha",
            Router: "/captcha?:seed",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
