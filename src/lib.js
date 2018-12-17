const { parseInput } = require('./parser.js');
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

const seperator = { n: '\n', c: '' };

const getHeadContent = function(file, count, option) {
	return file
		.split(seperator[option])
		.slice(0, count)
		.join(seperator[option]);
};

const getTailContent = function(file, count, option) {
	return file
		.split(seperator[option])
		.slice(-count)
		.join(seperator[option]);
};

const extractContent = {
	head: getHeadContent,
	tail: getTailContent
};

const getContent = function(parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	let getFileContent = extractContent[operation];
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync)) {
		return getFileContent(readFileSync(fileNames[0], 'utf8'), count, option);
	}

	for (let file of fileNames) {
		let fileContent = displayFileNotFoundError(file, operation);
		if (existsSync(file)) {
			fileContent = delimeter + generateHeader(file);
			fileContent += getFileContent(readFileSync(file, 'utf8'), count, option);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const head = function(arguments, fs) {
	let parameters = parseInput(arguments);
	let { option, count } = parameters;
	let error = validateHeadArguments(arguments, count, option);
	return error || getContent(parameters, fs, 'head');
};

const tail = function(arguments, fs) {
	let parameters = parseInput(arguments);
	let { count, fileNames } = parameters;
	let error = validateTailArguments(arguments, count, fileNames);

	if (error != undefined) {
		return error;
	}
	return getContent(parameters, fs, 'tail');
};

module.exports = {
	head,
	getHeadContent,
	getTailContent,
	tail,
	getContent,
	isValidSingleFile,
	generateHeader,
	displayFileNotFoundError
};
