package utils

import (
	"fmt"
	"github.com/satori/go.uuid"
	"math/rand"
	"time"
)

func GenerateUUID() string {
	u2 := uuid.NewV4()
	return u2.String()
}

func GenRandom() string {
	return fmt.Sprintf("%06v", rand.New(rand.NewSource(time.Now().UnixNano())).Int31n(1000000))
}
