package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "Put",
            Router: "/:id",
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "ChangeEmail",
            Router: "/changeEmail",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "ChangePassword",
            Router: "/changePassword",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "CurrentUser",
            Router: "/currentUser",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "DialogueList",
            Router: "/dialogue",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "DialogueDetail",
            Router: "/dialogue/message",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "SendMessage",
            Router: "/dialogue/message",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "UserInfo",
            Router: "/info",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "ListLabels",
            Router: "/listLabels",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "Login",
            Router: "/login",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "SendEmailCaptcha",
            Router: "/sendEmailCaptcha",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "UserNoticeSetting",
            Router: "/userNoticeSetting",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "PutUserNoticeSetting",
            Router: "/userNoticeSetting",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/users:UserController"],
        beego.ControllerComments{
            Method: "UserSecurity",
            Router: "/userSecurity",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
