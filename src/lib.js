const { parseInput } = require('./parser.js');
const {
	validateHeadArguments,
	validateTailArguments
} = require('./errorHandler.js');

const isValidSingleFile = function(fileNames, existsSync) {
	return fileNames.length == 1 && existsSync(fileNames[0]);
};

const extractHeadLines = function(file, count) {
	return file.split('\n').slice(0,count).join("\n");
};

const extractHeadCharacters = function(file, count) {
	return file.split('').slice(0,count).join('');
}

const extractTailLines = function(file, count) {
	return file.split('\n').slice(-count).join("\n");
};

const extractTailCharacters = function(file, count) {
	return file.split('').slice(-count).join("");
};

const fetchMultipleFileData = function(details, fileContent, fileName) {
	let { contents, delimeter } = fileContent;
	let { existsSync, count, binaryFunc, readFileSync, operation } = details;

	if (existsSync(fileName)) {
		contents.push(delimeter + '==> ' + fileName + ' <==');
		contents.push(
			binaryFunc(readFileSync(fileName, 'utf8'), count)
		);
		fileContent.delimeter = '\n';
		return fileContent;
	}

	contents.push(operation + ': ' + fileName + ': No such file or directory');
	fileContent.delimeter = '\n';

	return fileContent;
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

const getContent = function(parameters, fs, operation) {
	let { readFileSync, existsSync } = fs;
	let { option, count, fileNames } = parseInput(parameters);
	let binaryFunc = extractContent[operation][option];
	let details = { existsSync, count : parseInt(count), binaryFunc, readFileSync, operation }
	if (isValidSingleFile(fileNames, existsSync))
		return binaryFunc(readFileSync(fileNames[0], "utf8"), count);
	let multipleFileData = fetchMultipleFileData.bind(null, details);
	return fileNames
		.reduce(multipleFileData, { contents: [], delimeter: '' })
		.contents.join('\n');
};

const head = function(parameters, fs) {
	let { option, count } = parseInput(parameters);
	let error = validateHeadArguments(parameters, count, option);
	return error || getContent(parameters, fs, 'head');
};

const tail = function(parameters, fs) {
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
	fetchMultipleFileData,
	validateHeadArguments,
	validateTailArguments,
	getContent,
	isValidSingleFile
};
