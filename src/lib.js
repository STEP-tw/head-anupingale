const { parseInput } = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const isValidSingleFile = function (fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const extractHeadLines = function (file, count) {
	return file.split('\n').slice(0, count).join('\n');
};

const extractHeadCharacters = function (file, count) {
	return file.split('').slice(0, count).join('');
};

const extractTailLines = function (file, count) {
	return file.split('\n').slice(-count).join('\n');
};

const extractTailCharacters = function (file, count) {
	return file.split('').slice(-count).join('');
};

const extractContent = {
	head: {
		n: extractHeadLines,
		c: extractHeadCharacters
	},
	tail: {
		n: extractTailLines,
		c: extractTailCharacters
	}
};

const getContent = function (parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parseInput(parameters);
	let binaryFunc = extractContent[operation][option];
	let contents = [];
	let delimeter = '';
	if (isValidSingleFile(fileNames, existsSync))
		return binaryFunc(readFileSync(fileNames[0], 'utf8'), count);

	for (let index = 0; index < fileNames.length; index++) {
		let fileContent = operation + ': ' + fileNames[index] + ': No such file or directory';
		if (existsSync(fileNames[index])) {
			fileContent = delimeter + '==> ' + fileNames[index] + ' <==\n';
			fileContent += binaryFunc(readFileSync(fileNames[index], 'utf8'), count);
			delimeter = '\n';
		}
		contents.push(fileContent);
	}
	return contents.join('\n');
};

const head = function (parameters, fs) {
	let { option, count } = parseInput(parameters);
	let error = validateHeadArguments(parameters, count, option);
	return error || getContent(parameters, fs, 'head');
};

const tail = function (parameters, fs) {
	let { count, fileNames } = parseInput(parameters);
	let error = validateTailArguments(parameters, count, fileNames);

	if (error != undefined) {
		return error;
	}

	return getContent(parameters, fs, 'tail');
};

module.exports = {
	extractHeadLines,
	extractHeadCharacters,
	head,
	extractTailLines,
	extractTailCharacters,
	tail,
	validateHeadArguments,
	validateTailArguments,
	getContent,
	isValidSingleFile
};
