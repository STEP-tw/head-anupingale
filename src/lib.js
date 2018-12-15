const { parseInput } = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const isValidSingleFile = function (fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const displayFileNotFoundError = function (file, operation) {
	return operation+ ": " + file + ": No such file or directory";
};

const generateHeader = function (fileName) {
	return "==> " + fileName + " <==\n";
};

const getLinesFromTop = function (file, count) {
	return file.split('\n').slice(0, count).join('\n');
};

const getCharactersFromTop = function (file, count) {
	return file.split('').slice(0, count).join('');
};

const getLinesFromBottom = function (file, count) {
	return file.split('\n').slice(-count).join('\n');
};

const getCharactersFromBottom = function (file, count) {
	return file.split('').slice(-count).join('');
};

const extractContent = {
	head: {
		n: getLinesFromTop,
		c: getCharactersFromTop
	},
	tail: {
		n: getLinesFromBottom,
		c: getCharactersFromBottom
	}
};

const getContent = function (parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	let getFileContent = extractContent[operation][option];
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync)) {
		return getFileContent(readFileSync(fileNames[0], 'utf8'), count);
	}

	for (let file of fileNames) {
		let fileContent = displayFileNotFoundError(file, operation);
		if (existsSync(file)) {
			fileContent = delimeter + generateHeader(file);
			fileContent += getFileContent(readFileSync(file, 'utf8'), count);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const head = function (arguments, fs) {
	let parameters = parseInput(arguments);
	let { option, count } = parameters;
	let error = validateHeadArguments(arguments, count, option);
	return error || getContent(parameters, fs, 'head');
};

const tail = function (arguments, fs) {
	let parameters = parseInput(arguments);
	let { count, fileNames } = parameters;
	let error = validateTailArguments(arguments, count, fileNames);

	if (error != undefined) {
		return error;
	}
	return getContent(parameters, fs, 'tail');
};

module.exports = {
	getLinesFromTop,
	getCharactersFromTop,
	head,
	getLinesFromBottom,
	getCharactersFromBottom,
	tail,
	getContent,
	isValidSingleFile,
	generateHeader,
	displayFileNotFoundError
};
