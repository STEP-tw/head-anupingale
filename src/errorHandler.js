const { hasDash } = require('./parser.js');

const isZero = function(value) {
	return value == 0;
};

const hasInvalidCount = function(count) {
	return isNaN(count) || count < 1;
};

const invalidOptionError = function(option, operation) {
	return (
		operation +
		': illegal option -- ' +
		option +
		'\nusage: ' +
		operation +
		' [-n lines | -c bytes] [file ...]'
	);
};

const invalidCountError = function(option, count) {
	let errors = {
		n: 'head: illegal line count -- ',
		c: 'head: illegal byte count -- '
	};
	return errors[option] + count;
};

const hasInvalidOption = function(parameters) {
	let invalidOption =
		hasDash(parameters[0]) && !['n', 'c'].includes(parameters[1]);
	return invalidOption && !parseInt(parameters);
};

const validateHeadArguments = function(parameters, count, option) {
	if (isZero(parameters[0])) {
		return 'head: illegal line count -- 0';
	}
	if (hasInvalidCount(count)) {
		return invalidCountError(option, count);
	}
	if (hasInvalidOption(parameters[0])) {
		return invalidOptionError(parameters[0][1], 'head');
	}
};

const validateTailArguments = function(parameters, count, files) {
	if (files.includes('-0') || count == 0) {
		return '';
	}

	if (isNaN(count)) {
		return 'tail: illegal offset -- ' + parameters[0].slice(2);
	}

	if (hasInvalidOption(parameters[0])) {
		return invalidOptionError(parameters[0][1], 'tail');
	}
};

const displayFileNotFoundError = function(file, operation) {
	return operation + ': ' + file + ': No such file or directory';
};

module.exports = {
	validateHeadArguments,
	displayFileNotFoundError,
	validateTailArguments,
	isZero,
	hasInvalidOption,
	hasInvalidCount,
	invalidCountError,
	invalidOptionError
};
