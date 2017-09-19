export PATH := $(shell pwd)/node_modules/.bin:$(PATH)
.PHONY: init dev build clean genRoutes

init:
	yarn

dev:
	yarn dev

build:
	yarn build

clean:
	rm -rf dist

genRoutes:
	node ./tool/genRoutes.js
