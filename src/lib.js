const { parseInput, hasOption } = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const has = function(arguments) {
code
}

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

const singleFileData = function(file, details) {
	let { existsSync, readFileSync, count, binaryFunc, operation } = details;
	if (!existsSync(file)) {
		return operation + ': ' + file + ': No such file or directory';
	}
	return binaryFunc(readFileSync(file, 'utf8').split('\n'), count);
};

const retrieveData = function(details, fileName) {
	let {
		delimeter,
		readFileSync,
		contents,
		existsSync,
		binaryFunc,
		count,
		operation
	} = details;
	if (!existsSync(fileName)) {
		contents.push(operation + ': ' + fileName + ': No such file or directory');
		details.delimeter = '\n';
		return details;
	}
	contents.push(delimeter + '==> ' + fileName + ' <==');
	contents.push(binaryFunc(readFileSync(fileName, 'utf8').split('\n'), count));
	details.delimeter = '\n';
	return details;
};

const getContent = function(fileDetails, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, files } = parseInput(fileDetails);
	let reference = {
		head: { n: extractHeadLines, c: extractHeadCharacters },
		tail: { n: extractTailLines, c: extractTailCharacters }
	};
	let binaryFunc = reference[operation][option];
	let details = {
		contents: [],
		existsSync,
		count: parseInt(count),
		binaryFunc,
		readFileSync,
		operation,
		delimeter: ''
	};

	if (files.length == 1) {
		return singleFileData(files[0], details);
	}
	return files.reduce(retrieveData, details).contents.join('\n');
};

const head = function(fileDetails, fs) {
  let { option, count } = parseInput(fileDetails);
  let error = validateHeadArguments(fileDetails, count, option);
	return error || getContent(fileDetails, fs, 'head');
};

const tail = function(fileDetails, fs) {
  let { count, files } = parseInput(fileDetails);
  let error = validateTailArguments(fileDetails, count, files);
	if (error != undefined) {
		return error;
	}
	return getContent(fileDetails, fs, 'tail');
};

module.exports = {
	extractHeadLines,
	extractHeadCharacters,
	head,
	hasOption,
	extractTailLines,
	extractTailCharacters,
	tail,
	retrieveData,
	validateHeadArguments,
	validateTailArguments,
	getContent
};
