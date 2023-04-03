package mock

import (
	"fantasy-api/models"
	"k8s.io/klog"
)

var tmks = []models.Tag{
	{
		Name: "python",
	},
	{
		Name: "golang",
	},
	{
		Name: "javascript",
	},
}

func TagConstruct() {

	for _, data := range tmks {
		if pk, err := models.TagModel.Create(&data); err != nil {
			continue
		} else {
			klog.Infof("pk: %s data: %v is created.", pk, data)
		}
	}
}
