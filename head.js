const fs = require('fs');
const { parse } = require('./src/parser.js');
const { fetchContent } = require('./src/lib.js');

const main = function(args) {
	let parameters = parse(args.slice(2));
	console.log(fetchContent(parameters, fs, 'head'));
};

main(process.argv);
