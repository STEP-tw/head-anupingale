const fs = require('fs');
const { parse } = require('./src/parser.js');
const { getData } = require('./src/lib.js');

const main = function(args) {
	let parameters = parse(args.slice(2));
	console.log(getData(parameters, fs, 'head'));
};

main(process.argv);
