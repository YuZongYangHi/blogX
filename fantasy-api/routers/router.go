package routers

import (
	"fantasy-api/controllers/admin/article"
	"fantasy-api/controllers/admin/audit"
	"fantasy-api/controllers/admin/overview"
	"fantasy-api/controllers/admin/users"
	"fantasy-api/controllers/common"
	"fantasy-api/controllers/public"
	"github.com/astaxie/beego"
	"k8s.io/klog"
)

func init() {

	// user public routers
	namespaceCommonRouters := beego.NewNamespace("/api/v1",
		beego.NSNamespace("/common",
			beego.NSInclude(&common.CaptchaController{}),
		),
	)

	// admin public routers
	namespaceAdminRouters := beego.NewNamespace("/api/v1/admin",
		beego.NSNamespace("/users",
			beego.NSInclude(&users.UserController{}),
		),
		beego.NSNamespace("/article",
			beego.NSInclude(&article.Controller{}),
		),
		beego.NSNamespace("/category",
			beego.NSInclude(&article.CategoryController{}),
		),
		beego.NSNamespace("/tag",
			beego.NSInclude(&article.TagController{}),
		),
		beego.NSNamespace("/audit",
			beego.NSInclude(&audit.Controller{}),
		),
		beego.NSNamespace("/overview",
			beego.NSInclude(&overview.Controller{}),
		),
	)

	// public router
	namespacePublicRouters := beego.NewNamespace("/api/v1/public",
		beego.NSNamespace("/category",
			beego.NSInclude(&public.CategoryController{})),
		beego.NSNamespace("/article",
			beego.NSInclude(&public.ArticleController{})),
		beego.NSNamespace("/users",
			beego.NSInclude(&public.UserController{}),
		),
		beego.NSNamespace("/author",
			beego.NSInclude(&public.AuthorController{}),
		),
	)

	if runtime := beego.AppConfig.String("runmode"); runtime == "dev" {
		klog.Infof("current runtime mode: dev, start cors")
		beego.InsertFilter("*", beego.BeforeRouter, corsFunc)
	}

	// admin middleware
	beego.InsertFilter("/api/v1/admin/*", beego.BeforeRouter, AdminUserAuthMiddleware)

	// user middleware
	beego.InsertFilter("/api/v1/public/*", beego.BeforeRouter, PublicUserAuthMiddleware)

	// aggregation
	beego.AddNamespace(namespaceCommonRouters, namespaceAdminRouters, namespacePublicRouters)
}
