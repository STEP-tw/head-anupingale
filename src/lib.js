const {
	fileNotFoundError,
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const isValidFile = function(fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const generateHeader = function(fileName) {
	return '==> ' + fileName + ' <==\n';
};

const seperators = { n: '\n', c: '' };

const fetchRequiredContent = function(file, option, count, utility) {
	let ranges = { head: [0, count], tail: [-count] };
	let range = ranges[utility];
	return file
		.split(seperators[option])
		.slice(range[0], range[1])
		.join(seperators[option]);
};

const getMultipleFileContent = function(parameters, fs, utility) {
	let { option, count, fileNames } = parameters;
	let { readFileSync, existsSync } = fs;
	let contents = [];
	let delimeter = '';
	for (let fileName of fileNames) {
		let fileContent = fileNotFoundError(fileName, utility);
		if (existsSync(fileName)) {
			content = readFileSync(fileName, 'utf8');
			fileContent = delimeter + generateHeader(fileName);
			fileContent += fetchRequiredContent(content, option, count, utility);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const getFileContent = function(parameters, fs, utility) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	if (isValidFile(fileNames, existsSync)) {
		let content = readFileSync(fileNames[0], 'utf8');
		return fetchRequiredContent(content, option, count, utility);
	}
	return getMultipleFileContent(parameters, fs, utility);
};

const head = function(parameters, fs) {
	let error = validateHeadArguments(parameters);
	return error || getFileContent(parameters, fs, 'head');
};

const tail = function(parameters, fs) {
	let error = validateTailArguments(parameters);
	parameters.count = Math.abs(parameters.count);
	return error || getFileContent(parameters, fs, 'tail');
};

module.exports = {
	head,
	fetchRequiredContent,
	tail,
	getFileContent,
	getMultipleFileContent,
	isValidFile,
	generateHeader
};
