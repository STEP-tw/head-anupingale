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

const getSpecifiedContent = function(file, option, count, operation) {
	let ranges = { head: [0, count], tail: [-count] };
	let range = ranges[operation];
	return file
		.split(seperator[option])
		.slice(range[0], range[1])
		.join(seperator[option]);
};

const getContent = function(parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync)) {
		return getSpecifiedContent(
			readFileSync(fileNames[0], 'utf8'),
			option,
			count,
			operation
		);
	}

	for (let file of fileNames) {
		let fileContent = displayFileNotFoundError(file, operation);
		if (existsSync(file)) {
			fileContent = delimeter + generateHeader(file);
			fileContent += getSpecifiedContent(
				readFileSync(file, 'utf8'),
				option,
				count,
				operation
			);
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
	getSpecifiedContent,
	tail,
	getContent,
	isValidSingleFile,
	generateHeader,
	displayFileNotFoundError
};
