package article

/*
	DraftArticle
	考虑到已经存在的文章再一次保存为草稿， 所以需要判断有没有文章ID
	没有文章ID -> 创建
	有文章ID -> 覆盖title && content && author
*/
type DraftArticle struct {
	ArticleId int    `json:"articleId"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	Author    string `json:"author"`
}

type CreateArticleParams struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	Image      string `json:"image"`
	CategoryId int    `json:"categoryId"`
	TagIds     []int  `json:"tagIds"`
	IsTop      bool   `json:"isTop"`
	IsOriginal bool   `json:"isOriginal"`
	ArticleId  int    `json:"articleId"`
}

type ListSearchLabels struct {
	Label string `json:"label"`
	Value int    `json:"value"`
}

type OperationParams struct {
	Action    string `json:"action"`
	Field     string `json:"field"`
	Where     bool   `json:"where"`
	ArticleId int    `json:"articleId"`
}

type TagCategoryCreated struct {
	Name string `json:"name"`
}
