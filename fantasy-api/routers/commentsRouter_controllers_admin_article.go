package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"],
        beego.ControllerComments{
            Method: "List",
            Router: "/",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"],
        beego.ControllerComments{
            Method: "Post",
            Router: "/",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"],
        beego.ControllerComments{
            Method: "Put",
            Router: "/:id",
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"],
        beego.ControllerComments{
            Method: "Delete",
            Router: "/:id",
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:CategoryController"],
        beego.ControllerComments{
            Method: "ListLabels",
            Router: "/listLabels",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"],
        beego.ControllerComments{
            Method: "List",
            Router: "/",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"],
        beego.ControllerComments{
            Method: "Post",
            Router: "/",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"],
        beego.ControllerComments{
            Method: "Get",
            Router: "/:id",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"],
        beego.ControllerComments{
            Method: "OperationController",
            Router: "/operation/",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:Controller"],
        beego.ControllerComments{
            Method: "SaveDraft",
            Router: "/saveDraft",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"],
        beego.ControllerComments{
            Method: "List",
            Router: "/",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"],
        beego.ControllerComments{
            Method: "Post",
            Router: "/",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"],
        beego.ControllerComments{
            Method: "Put",
            Router: "/:id",
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"],
        beego.ControllerComments{
            Method: "Delete",
            Router: "/:id",
            AllowHTTPMethods: []string{"delete"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/admin/article:TagController"],
        beego.ControllerComments{
            Method: "ListLabels",
            Router: "/listLabels",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
