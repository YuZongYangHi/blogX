package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "AutoView",
            Router: "/:id/autoView",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "ArticleComments",
            Router: "/:id/comments",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "AddComment",
            Router: "/comments",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "Detail",
            Router: "/detail/:id",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "Like",
            Router: "/like",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "List",
            Router: "/list",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "Newest",
            Router: "/newest",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "NewestComments",
            Router: "/newestComments",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "Popular",
            Router: "/popular",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "TagPool",
            Router: "/tag/pool",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:ArticleController"],
        beego.ControllerComments{
            Method: "ArticleTopList",
            Router: "/topList",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"],
        beego.ControllerComments{
            Method: "Followers",
            Router: "/followers",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"],
        beego.ControllerComments{
            Method: "GetFollowers",
            Router: "/followers",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"],
        beego.ControllerComments{
            Method: "ListMessage",
            Router: "/message",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:AuthorController"],
        beego.ControllerComments{
            Method: "SendMessage",
            Router: "/message",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:CategoryController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:CategoryController"],
        beego.ControllerComments{
            Method: "Routers",
            Router: "/routers",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "Put",
            Router: "/:id",
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "Activation",
            Router: "/activation/:id",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "PublicChangeEmail",
            Router: "/changeEmail",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "ChangePassword",
            Router: "/changePassword",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "CurrentUser",
            Router: "/currentUser",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "Login",
            Router: "/login",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "Logout",
            Router: "/logout",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "Register",
            Router: "/register",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "ResetPassword",
            Router: "/resetPassword",
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "PublicSendEmailCaptcha",
            Router: "/sendEmailCaptcha",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "SendResetCaptcha",
            Router: "/sendResetCaptcha/",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"] = append(beego.GlobalControllerRouter["fantasy-api/controllers/public:UserController"],
        beego.ControllerComments{
            Method: "PublicUserSecurity",
            Router: "/userSecurity",
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
