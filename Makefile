install:
	npm ci

build:
	rm -rf public
	npx webpack

test:
	npm test

lint:
	npx eslint .

.PHONY: test
