# Build variables
IMAGE?=registry.kenc.ksyun.com/kenc/pacific-controller

# VERSION:=$(shell git describe --always --tags)

# variable 
VERSION=v0.0.4
app=pacific-controller

# set context env 
export GIN_MODE=release

DOCKER_REPO=$(IMAGE):$(VERSION)
DOCKER_REPO_LATEST=$(IMAGE):latest

build-image:
	docker build -t $(DOCKER_REPO) .

push: build-image
	docker push $(DOCKER_REPO)

machine-build:
	go build -o ./bin/$(app)

machine-linux-build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o fantasy-api
