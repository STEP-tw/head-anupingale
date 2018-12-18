const isZero = function(value) {
	return value == 0;
};

const hasInvalidCount = function(count) {
	return isNaN(count) || count < 1;
};

const invalidOptionError = function(option) {
	return (
		'head: illegal option -- ' +
		option +
		'\nusage: head [-n lines | -c bytes] [file ...]'
	);
};

const invalidCountError = function(option, count) {
	let errors = {
		n: 'head: illegal line count -- ',
		c: 'head: illegal byte count -- '
	};
	return errors[option] + count;
};

const hasInvalidOption = function(option) {
	return !['n', 'c'].includes(option);
};

const validateHeadArguments = function(parameters) {
	let { option, count, fileNames } = parameters;

	if (hasInvalidOption(option)) {
		return invalidOptionError(option);
	}

	if (isZero(count) || fileNames.includes('-0')) {
		return 'head: illegal line count -- 0';
	}

	if (hasInvalidCount(count)) {
		return invalidCountError(option, count);
	}
};

const validateTailArguments = function(parameters) {
	let { option, count, fileNames } = parameters;
	if (isZero(count) || fileNames.includes('-0')) {
		return ' ';
	}

	if (isNaN(count)) {
		return 'tail: illegal offset -- ' + count;
	}

	if (count < 0) {
		return 'tail: illegal offset -- ' + count.slice(1);
	}

	if (hasInvalidOption(option)) {
		return (
			'tail: illegal option -- ' +
			option +
			'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]'
		);
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
