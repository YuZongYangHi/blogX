package base

import (
	"fantasy-api/models"
	"github.com/astaxie/beego"
	"strconv"
	"strings"
)

type QueryParam struct {
	// 页面大小
	PageSize int `json:"pageSize"`

	// 当前页
	PageNum int `json:"pageNum"`

	// 数据总数分成的页面总数 -
	PageTotal int `json:"pageTotal"`

	// 数据总数
	DataTotal int64 `json:"dataTotal"`

	// query
	Params map[string]string `json:"-"`
}

type ParamsBuildController struct {
	ResultHandlerController
}

func (c *ParamsBuildController) GetNoArgsURL() string {
	return strings.Split(c.Ctx.Request.RequestURI, "?")[0]
}

func (c *ParamsBuildController) IsReleaseURL() bool {
	url := c.GetNoArgsURL()
	if _, err := models.URLWhitelistModel.QueryURLWhitelist(url); err == nil {
		return true
	}
	return false
}

/*
	ParamsSearch
	根据参数查询
	filter = "name=111,age=222"
*/
func (c *ParamsBuildController) ParamsSearch() map[string]string {
	qs := map[string]string{}

	filter := c.Ctx.Input.Query("filter")

	if filter == "" {
		return qs
	}

	filters := strings.Split(filter, ",")
	for _, param := range filters {
		params := strings.Split(param, "=")
		if len(params) != 2 {
			continue
		}

		key, value := params[0], params[1]
		qs[key] = value
	}
	return qs
}

func (c *ParamsBuildController) BuildParams() *QueryParam {
	var (
		PageNum int
	)

	PageSize, _ := beego.AppConfig.Int("default_page_size")

	if size := c.Ctx.Input.Query("pageSize"); size != "" {
		PageSize, _ = strconv.Atoi(size)
	}

	if num := c.Ctx.Input.Query("pageNum"); num != "" {
		PageNum, _ = strconv.Atoi(num)
	} else {
		PageNum = 1
	}

	return &QueryParam{
		PageSize:  PageSize,
		PageNum:   PageNum,
		PageTotal: 0,
		DataTotal: 0,
		Params:    c.ParamsSearch(),
	}
}
