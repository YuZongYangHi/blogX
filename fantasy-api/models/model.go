package models

var (
	AuthorModel              *Author
	UserModel                *User
	GroupModel               *Group
	URLFrequencyLimitModel   *URLFrequencyLimit
	URLWhitelistModel        *URLWhitelist
	CategoryModel            *Category
	TagModel                 *Tag
	CommentModel             *Comment
	ArticleModel             *Article
	UserLikeArticleModel     *UserLikeArticle
	UserFollowerModel        *UserFollowers
	PrivateMessageModel      *PrivateMessage
	UserLoginModel           *UserLogin
	UserOperationRecordModel *UserOperationRecord
	AccessRecordModel        *AccessRecord
	BlacklistModel           *Blacklist
)

func init() {
	AuthorModel = &Author{}
	UserModel = &User{}
	GroupModel = &Group{}
	URLFrequencyLimitModel = &URLFrequencyLimit{}
	URLWhitelistModel = &URLWhitelist{}
	CategoryModel = &Category{}
	TagModel = &Tag{}
	CommentModel = &Comment{}
	ArticleModel = &Article{}
	UserLikeArticleModel = &UserLikeArticle{}
	UserFollowerModel = &UserFollowers{}
	PrivateMessageModel = &PrivateMessage{}
	UserLoginModel = &UserLogin{}
	UserOperationRecordModel = &UserOperationRecord{}
	AccessRecordModel = &AccessRecord{}
	BlacklistModel = &Blacklist{}
}
