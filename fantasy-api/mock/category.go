package mock

import (
	"fantasy-api/models"
	"k8s.io/klog"
)

var mocks = []models.Category{
	{
		Name: "Python",
	},
	{
		Name: "Golang",
	},
	{
		Name: "JavaScript",
	},
}

func CategoryConstruct() {

	for _, data := range mocks {
		if pk, err := models.CategoryModel.Create(&data); err != nil {
			continue
		} else {
			klog.Infof("pk: %s data: %v is created.", pk, data)
		}
	}
}
