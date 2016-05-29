test:
	./node_modules/.bin/mocha --reporter spec

lint:
	./node_modules/.bin/nodelint --config=./conf/lint-config.json ./src/index.js

docs:
	./node_modules/.bin/esdoc -c conf/esdoc.json

.PHONY: test doc
