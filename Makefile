.PHONY: minify

minify: generate.min.js

generate.min.js: generate.js
	yuicompressor generate.js -o generate.min.js



