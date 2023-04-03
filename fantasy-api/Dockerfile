# requiring Docker 17.05 or higher on the daemon and client
# see https://docs.docker.com/develop/develop-images/multistage-build/
# BUILD COMMAND :
# docker build -t $(IMAGE) .

# build server
FROM registry.kenc.ksyun.com/library/golang:1.13 AS builder

MAINTAINER YUZONGYANG <yuzongyang@kingsoft.com>

RUN mkdir -p /devops/app/

COPY ./ /devops/app/pacific-controller/

ENV GO111MODULE=on GOPROXY=https://goproxy.io

WORKDIR /devops/app/pacific-controller/

RUN go build -o ./bin/pacific-controller

# build release image
FROM registry.kenc.ksyun.com/library/centos:7

MAINTAINER YUZONGYANG <yuzongyang@kingsoft.com>

USER root

ENV GIN_MODE=release

COPY --from=builder /devops/app/pacific-controller/bin/pacific-controller /root/

WORKDIR /root/

EXPOSE 1998

ENTRYPOINT ["./pacific-controller"]