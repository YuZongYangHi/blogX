package users

type UserLoginParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Captcha  string `json:"captcha"`
}

type UserAuthResponse struct {
	ErrorCode    int         `json:"errorCode"`
	ErrorMessage string      `json:"errorMessage"`
	Data         interface{} `json:"data"`
}

type ListSearchLabels struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type UserBasicPutFields struct {
	Avatar      string `json:"avatar"`
	Display     string `json:"display"`
	Gender      int    `json:"gender"`
	City        string `json:"city"`
	Description string `json:"description"`
}

type UserSecurityInfo struct {
	UserId   string `json:"userId"`
	UserName string `json:"userName"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type UserSecurityEmailUpdate struct {
	UserId   string `json:"userId"`
	SrcEmail string `json:"srcEmail"`
	DstEmail string `json:"dstEmail"`
	Captcha  string `json:"captcha"`
}

type UserSecurityPasswordUpdate struct {
	UserId          string `json:"userId"`
	UserName        string `json:"userName"`
	Email           string `json:"email"`
	SrcPassword     string `json:"srcPassword"`
	DstPassword     string `json:"dstPassword"`
	ConfirmPassword string `json:"confirmPassword"`
	Captcha         string `json:"captcha"`
}

type UserSettingNotice struct {
	UserId              string `json:"userId"`
	IsLikeNotice        bool   `json:"isLikeNotice"`
	IsCommentNotice     bool   `json:"isCommentNotice"`
	IsFollowNotice      bool   `son:"isFollowNotice"`
	IsPrivateChatNotice bool   `json:"isPrivateChatNotice"`
}
