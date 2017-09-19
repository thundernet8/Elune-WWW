export PATH := $(shell pwd)/node_modules/.bin:$(PATH)
.PHONY: init aly dev build clean genRoutes

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
	rm -rf ssr

genRoutes:
	node ./tool/genRoutes.js
