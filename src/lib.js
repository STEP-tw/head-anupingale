const { parse } = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments,
	displayFileNotFoundError
} = require('./errorHandler.js');

const isValidSingleFile = function(fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const generateHeader = function(fileName) {
	return '==> ' + fileName + ' <==\n';
};

const seperators = { n: '\n', c: '' };

const getSpecifiedContent = function(file, option, count, operation) {
	let ranges = { head: [0, count], tail: [-count] };
	let range = ranges[operation];
	return file
		.split(seperators[option])
		.slice(range[0], range[1])
		.join(seperators[option]);
};

const getContent = function(parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync)) {
		let content = readFileSync(fileNames[0], 'utf8');
		return getSpecifiedContent(content, option, count, operation);
	}

	for (let fileName of fileNames) {
		let fileContent = displayFileNotFoundError(fileName, operation);
		if (existsSync(fileName)) {
			content = readFileSync(fileName, 'utf8');
			fileContent = delimeter + generateHeader(fileName);
			fileContent += getSpecifiedContent(content, option, count, operation);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const head = function(args, fs) {
	let parameters = parse(args);
	let error = validateHeadArguments(parameters);
	return error || getContent(parameters, fs, 'head');
};

const tail = function(args, fs) {
	let parameters = parse(args);
	let error = validateTailArguments(parameters);
	return error || getContent(parameters, fs, 'tail');
};

module.exports = {
	head,
	getSpecifiedContent,
	tail,
	getContent,
	isValidSingleFile,
	generateHeader,
	displayFileNotFoundError
};
