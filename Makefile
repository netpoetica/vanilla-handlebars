build: components index.js
	@component build --standalone VanillaHandlebars

components: component.json
	@component install --dev

clean:
	rm -fr build components

test:
	@mocha-phantomjs test/index.html

.PHONY: clean test