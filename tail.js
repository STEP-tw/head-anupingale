const fs = require('fs');
const { parse } = require('./src/parser.js');
const { tail } = require('./src/lib.js');

const main = function(args) {
	let parameters = parse(args.slice(2));
	console.log(tail(parameters, fs));
};

main(process.argv);
