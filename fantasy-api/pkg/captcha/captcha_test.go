package captcha

import (
	"fmt"
	"testing"
)

func TestPic(t *testing.T) {
	s := ImgText(GetRandStr(6))
	fmt.Println(s)
}
