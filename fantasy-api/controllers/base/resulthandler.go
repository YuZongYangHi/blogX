package base

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"k8s.io/klog"
	"net/http"
)

type CommonResult struct {
	Success      bool           `json:"success"`
	Data         *ContentResult `json:"data"`
	ErrorCode    int            `json:"errorCode"`
	ErrorMessage string         `json:"errorMessage"`
	ShowType     int            `json:"showType"`
	TraceId      string         `json:"traceId"`
	Host         string         `json:"host"`
}

type ContentResult struct {
	List     interface{} `json:"list"`
	Current  int         `json:"current"`
	PageSize int         `json:"pageSize"`
	Total    int64       `json:"total"`
}

type ResultHandlerController struct {
	beego.Controller
	HandleResponse *CommonResult
}

func (c *ResultHandlerController) ErrorResponse(code int, msg string) {
	c.HandleResponse = c.NewHandleResultField()
	c.HandleResponse.ErrorCode = code
	c.HandleResponse.ErrorMessage = msg
	c.logs()
	c.CustomAbort(code, c.ReversedStr(c.HandleResponse))
}

func (c *ResultHandlerController) SuccessResponse(data interface{}, param *QueryParam) {
	c.HandleResponse = c.NewHandleResultField()
	c.HandleResponse.Success = true
	c.HandleResponse.Data = &ContentResult{
		List:     data,
		Current:  param.PageNum,
		PageSize: param.PageSize,
		Total:    param.DataTotal,
	}
	c.JsonResponse(c.HandleResponse)
}

func (c *ResultHandlerController) JsonResponse(data interface{}) {
	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Data["json"] = data
	c.logs()
	c.ServeJSON()
}

func (c *ResultHandlerController) logs() {
	klog.Infof("clientIp: %s, requestURL: %s", c.Ctx.Request.Header.Get("X-Real-ip"), c.Ctx.Request.RequestURI)
}

func (c *ResultHandlerController) HandleNotFound() {
	c.ErrorResponse(http.StatusNotFound, StatusNotFoundCodeMsg)
}

func (c *ResultHandlerController) HandleForbidden() {
	c.ErrorResponse(http.StatusForbidden, ForbiddenCodeMsg)
}

func (c *ResultHandlerController) HandleBadRequest(err error) {
	c.ErrorResponse(http.StatusBadRequest, fmt.Sprintf("%s: (%s)", BadRequestCodeMsg, err))
}

func (c *ResultHandlerController) HandleUnauthorized(err error) {
	c.ErrorResponse(http.StatusUnauthorized, fmt.Sprintf("%s: (%s)", UnauthorizedCodeMsg, err))
}

func (c *ResultHandlerController) HandleServerError(err error) {
	c.ErrorResponse(http.StatusInternalServerError, fmt.Sprintf("%s: (%s)", StatusInternalServerError, err))
}

func (c *ResultHandlerController) NewHandleResultField() *CommonResult {
	return new(CommonResult)
}

func (c *ResultHandlerController) ReversedStr(body interface{}) string {
	res, _ := json.Marshal(body)
	return fmt.Sprintf("%s", res)
}
