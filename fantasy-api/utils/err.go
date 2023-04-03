package utils

import "errors"

func TriggerError(content string) error {
	return errors.New(content)
}
