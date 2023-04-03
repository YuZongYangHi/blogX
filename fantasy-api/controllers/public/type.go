package public

type CategoryRouters struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type ArticleTopList struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Category string `json:"category"`
	Image    string `json:"image"`
}

type UserLikeArticle struct {
	UserId    string `json:"userId"`
	ArticleId int    `json:"articleId"`
}
