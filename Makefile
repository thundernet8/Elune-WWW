export PATH := $(shell pwd)/node_modules/.bin:$(PATH)
.PHONY: init aly dev build clean start stop genRoutes

TASKCOUNT = $(shell yarn tasklist | grep -ci "No forever processes running")

init:
	yarn

aly:
	yarn analyze

dev:
	yarn dev

build:
	yarn build

clean:
	rm -rf dist

start:
#Makefile中，当 ifeq, else 和 endif 没有缩进时，make会正确识别它们，将其作为分支选择的标识
#当 ifeq, else 和 endif 有缩进时，make将它们当做普通的shell script
ifeq ($(TASKCOUNT), 0)
	yarn restart
else
	yarn start:o
endif

stop:
ifeq ($(TASKCOUNT), 0)
	yarn stop
endif

genRoutes:
	node ./tool/genRoutes.js
