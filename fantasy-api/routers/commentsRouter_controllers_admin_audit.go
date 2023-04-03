package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "Users",
            Router: "/users",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "Access",
            Router: "/users/access",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "AllowLogin",
            Router: "/users/allowLogin",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "Blacklist",
            Router: "/users/blacklist",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "AddBlacklist",
            Router: "/users/blacklist",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "Login",
            Router: "/users/login",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/audit:Controller"],
        beego.ControllerComments{
            Method: "Operation",
            Router: "/users/operation",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
