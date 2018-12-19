const {
	validateArguments,
	fileNotFoundError
} = require('./errorHandler.js');

const isValidSingleFile = function(fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const generateHeader = function(fileName) {
	return '==> ' + fileName + ' <==\n';
};

const seperators = { n: '\n', c: '' };

const fetchRequiredContent = function(file, option, count, operation) {
	let ranges = { head: [0, count], tail: [-count] };
	let range = ranges[operation];
	return file
		.split(seperators[option])
		.slice(range[0], range[1])
		.join(seperators[option]);
};

const getFilesContent = function(parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parameters;
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync)) {
		let content = readFileSync(fileNames[0], 'utf8');
		return fetchRequiredContent(content, option, count, operation);
	}

	for (let fileName of fileNames) {
		let fileContent = fileNotFoundError(fileName, operation);
		if (existsSync(fileName)) {
			content = readFileSync(fileName, 'utf8');
			fileContent = delimeter + generateHeader(fileName);
			fileContent += fetchRequiredContent(content, option, count, operation);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const getData = function(parameters, fs, operation) {
	if (operation == 'tail' && parameters.count < 0) {
		parameters.count = Math.abs(parameters.count);
	}
	let error = validateArguments(parameters, operation);
	return error || getFilesContent(parameters, fs, operation);
};

module.exports = {
	getData,
	fetchRequiredContent,
	getFilesContent,
	isValidSingleFile,
	generateHeader,
	fileNotFoundError
};
