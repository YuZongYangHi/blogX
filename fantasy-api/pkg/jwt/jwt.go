package jwt

import (
	"errors"
	"github.com/astaxie/beego"
	"github.com/dgrijalva/jwt-go"
	"strings"
	"time"
)

type UserClaims struct {
	UserID   string `json:"userId"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
}

type Claims struct {
	UserClaims
	Exp time.Duration
	jwt.StandardClaims
}

// GenerateToken 申请token
func GenerateToken(customClaims UserClaims, exp time.Duration) (string, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(exp)

	claims := Claims{
		UserClaims: customClaims,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    beego.AppConfig.String("appname"),
		},
	}

	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString([]byte(beego.AppConfig.String("admin_user_token_secret")))
	return token, err
}

// ParseToken 解析token
func ParseToken(token string) (*Claims, error) {

	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(beego.AppConfig.String("admin_user_token_secret")), nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}
	return nil, err
}

// Authentication 验证token
func Authentication(token string) (*Claims, error) {

	if !VerifyTokenIsValid(token) {
		return nil, errors.New("invalid certificate")
	}

	_, token = SplitJwtToken(token)
	claims, err := ParseToken(token)

	if err != nil {
		return nil, errors.New(err.Error())
	}

	return claims, nil
}

func VerifyTokenIsValid(jwtToken string) bool {
	bearer, token := SplitJwtToken(jwtToken)

	if bearer == "" || token == "" {
		return false
	}

	if VerifyTokenType(jwtToken) {
		return true
	}

	return false
}

func VerifyTokenType(jwtToken string) bool {
	bearer, _ := SplitJwtToken(jwtToken)

	if bearer == "Bearer" {
		return true
	}
	return false
}

func SplitJwtToken(jwtToken string) (string, string) {
	sp := strings.Split(jwtToken, " ")
	if len(sp) != 2 {
		return "", ""
	}
	bearer, token := sp[0], sp[1]
	return bearer, token
}
