package utils

import (
	"errors"
	"sort"
	"strconv"
	"strings"
	"time"
)

func parseDuration(durationStr string) (time.Duration, error) {

	timeAttr := string(durationStr[len(durationStr)-1])
	realTime := strings.Split(durationStr, timeAttr)

	if len(realTime) != 2 {
		return 0, errors.New("invalid parsing format")
	}

	var (
		n, _ = strconv.Atoi(realTime[0])
		dur  = time.Duration(n) * time.Second
	)

	switch timeAttr {
	case "m":
		dur *= 60
	case "h":
		dur *= 60 * 60
	case "d":
		dur *= 60 * 60 * 24
	case "y":
		dur *= 60 * 60 * 24 * 365
	}
	return dur, nil
}

func TimeGranularityConversion(times string) time.Duration {
	if dur, err := parseDuration(times); err != nil {
		panic("parser config time error!")
	} else {
		return dur
	}
}

func GetRecent7timeList() []string {
	var result []string

	array := []int{0, -1, -2, -3, -4, -5, -6}
	currentTime := time.Now()

	for _, n := range array {
		beforeTimeFormat := currentTime.AddDate(0, 0, n).Format("2006-01-02")
		result = append(result, beforeTimeFormat)
	}

	sort.Strings(result)
	return result
}
