package models

type URLWhitelist struct {
	Id          int    `json:"id"`
	Url         string `orm:"unique;size(100)" json:"url"`
	Description string `orm:"size(100) null"json:"description"`
}

func (*URLWhitelist) TableName() string {
	return URLWhitelistTableName
}

func (*URLWhitelist) QueryURLWhitelist(url string) (*URLWhitelist, error) {
	o := URLWhitelist{
		Url: url,
	}
	return &o, Orm().Read(&o, "url")
}
