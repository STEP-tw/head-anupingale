const { parseInput} = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const isSingleFile = function(fileNames) {
	return fileNames.length == 1;
};

const extractHeadLines = function(file, numberOfLines) {
	return file.slice(0, numberOfLines).join('\n');
};

const extractHeadCharacters = function(file, numberOfCharacters) {
	return file.join('\n').slice(0, numberOfCharacters);
};

const extractTailLines = function(file, numberOfLines) {
	return file.slice(-numberOfLines).join('\n');
};

const extractTailCharacters = function(file, numberOfCharacters) {
	return file.join('\n').slice(-numberOfCharacters);
};

const fetchSingleFileData = function(file, details) {
	let { existsSync, readFileSync, count, binaryFunc, operation } = details;
	if (existsSync(file)) {
		return binaryFunc(readFileSync(file, 'utf8').split('\n'), count);
	}
	return operation + ': ' + file + ': No such file or directory';
};

const fetchMultipleFileData = function(details, fileContent, fileName) {
	let { contents, delimeter } = fileContent;
	let { existsSync, count, binaryFunc, readFileSync, operation } = details;
	
	if (existsSync(fileName)) {
		contents.push(delimeter + '==> ' + fileName + ' <==');
		contents.push(binaryFunc(readFileSync(fileName, 'utf8').split('\n'), count));
		fileContent.delimeter = '\n';
		return fileContent;
	}
	
	contents.push(operation + ': ' + fileName + ': No such file or directory');
	fileContent.delimeter = '\n';
	
	return fileContent;
};

const reference = {
	head: { n: extractHeadLines, c: extractHeadCharacters },
	tail: { n: extractTailLines, c: extractTailCharacters }
};

const getContent = function(fileDetails, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parseInput(fileDetails);
	
	let binaryFunc = reference[operation][option];
	let details = { existsSync, count: parseInt(count), binaryFunc, readFileSync, operation};
	let multipleFileData = fetchMultipleFileData.bind(null, details);

	if (isSingleFile(fileNames)) return fetchSingleFileData(fileNames[0], details);

	return fileNames.reduce(multipleFileData, { contents: [], delimeter: '' }).contents.join('\n');
};

const head = function(fileDetails, fs) {
	let { option, count } = parseInput(fileDetails);
	let error = validateHeadArguments(fileDetails, count, option);
	return error || getContent(fileDetails, fs, 'head');
};

const tail = function(fileDetails, fs) {
	let { count, fileNames } = parseInput(fileDetails);
	let error = validateTailArguments(fileDetails, count, fileNames);

	if (error != undefined) {
		return error;
	}

	return getContent(fileDetails, fs, 'tail');
};

module.exports = {
	extractHeadLines,
	extractHeadCharacters,
	head,
	extractTailLines,
	extractTailCharacters,
	tail,
	fetchMultipleFileData,
	validateHeadArguments,
	validateTailArguments,
	getContent,
	isSingleFile,
	fetchSingleFileData
};
