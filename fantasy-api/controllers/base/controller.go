package base

import (
	"bytes"
	"encoding/json"
	"fantasy-api/models"
	"k8s.io/klog"
	"math"
)

type Controller struct {
	ParamsBuildController
}

func (c *Controller) GetClientIp() string {
	return c.Ctx.Request.Header.Get("X-Real-ip")
}

/*
	QueryLimitPage
	查询分页器
	@table 表名
	@result 回调列表
*/
func (c *Controller) QueryPage(table string, result interface{}) (*QueryParam, error) {

	var err error
	params := c.BuildParams()

	qs := models.Orm().QueryTable(table)

	if len(params.Params) == 0 {
		_, err = qs.Limit(params.PageSize, params.PageSize*(params.PageNum-1)).
			OrderBy("-updated").
			RelatedSel().
			All(result)
	} else {
		for key, value := range params.Params {
			qs = qs.Filter(key, value)
		}
		_, err = qs.Limit(params.PageSize, params.PageSize*(params.PageNum-1)).
			OrderBy("-updated").
			RelatedSel().
			All(result)
	}

	DataTotal, _ := qs.Count()

	PageTotal := int(math.Ceil(float64(DataTotal) / float64(params.PageSize)))

	params.PageTotal = PageTotal
	params.DataTotal = DataTotal

	return params, err
}

/*
	OperationAudit
	操作审计
*/
func (c *Controller) OperationAudit(dstData interface{}, description string) {

	userId := c.GetSession("userId")

	if userId == nil {
		return
	}

	buf := new(bytes.Buffer)

	buf.ReadFrom(c.Ctx.Request.Body)

	dstByte, _ := json.Marshal(dstData)

	record := &models.UserOperationRecord{
		UserId:      userId.(string),
		URL:         c.Ctx.Request.RequestURI,
		Method:      c.Ctx.Request.Method,
		Description: description,
		SrcData:     buf.String(),
		DstData:     string(dstByte),
	}

	if err := models.UserOperationRecordModel.Add(record); err != nil {
		klog.Errorf("base.Controller -> OperationAudit -> Add Error: %s", err.Error())
	}
}

func (c *Controller) AccessRequestAutoRecord() {

	record := &models.AccessRecord{
		RemoteIp: c.GetClientIp(),
		URL:      c.Ctx.Request.RequestURI,
		Method:   c.Ctx.Request.Method,
	}

	if err := models.AccessRecordModel.Add(record); err != nil {
		klog.Errorf("base.Controller -> AccessRequestAutoRecord -> Add record error: %s", err.Error())
	}
}
