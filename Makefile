install:
	npm ci

dev:
	npx webpack serve

build:
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

.PHONY: test
