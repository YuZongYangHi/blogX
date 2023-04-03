package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"],
        beego.ControllerComments{
            Method: "ArticleOverview",
            Router: "/article",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"],
        beego.ControllerComments{
            Method: "ArticleReleaseTrend",
            Router: "/articleReleaseTrend",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"],
        beego.ControllerComments{
            Method: "UserOverview",
            Router: "/user",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/overview:Controller"],
        beego.ControllerComments{
            Method: "UserLoginTrend",
            Router: "/userLoginTrend",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
