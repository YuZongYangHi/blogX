package event

import (
	"fmt"
	"github.com/astaxie/beego"
	"gopkg.in/gomail.v2"
	"strconv"
)

var (
	mailStationName string
	mailHost        string
	mailUser        string
	mailPassword    string
	mailPort        string
)

func init() {
	mailStationName = beego.AppConfig.String("mail_station_name")
	mailHost = beego.AppConfig.String("mail_host")
	mailUser = beego.AppConfig.String("mail_user")
	mailPassword = beego.AppConfig.String("mail_pass")
	mailPort = beego.AppConfig.String("mail_port")
}

func SendMailBy163(mailTo []string, subject string, body string) error {

	mailConn := map[string]string{
		"user": mailUser,
		"pass": mailPassword,
		"host": mailHost,
		"port": mailPort,
	}

	port, _ := strconv.Atoi(mailConn["port"]) //转换端口类型为int

	m := gomail.NewMessage()

	// send
	m.SetHeader("From", m.FormatAddress(mailConn["user"], mailStationName))

	m.SetHeader("To", mailTo...)

	// title
	m.SetHeader("Subject", fmt.Sprintf("[%s] %s", mailStationName, subject))

	// make a copy for
	m.SetHeader("cc", mailUser)

	// send body type
	m.SetBody("text/html", body)

	d := gomail.NewDialer(mailConn["host"], port, mailConn["user"], mailConn["pass"])

	err := d.DialAndSend(m)
	return err
}
