const isZero = function(value) {
	return value == 0;
};

const hasInvalidCount = function(count) {
	return isNaN(count) || count < 1;
};

const invalidOptionError = function(option, operation) {
	let head =
		'head: illegal option -- ' +
		option +
		'\nusage: head [-n lines | -c bytes] [file ...]';
	let tail =
		'tail: illegal option -- ' +
		option +
		'\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
	operations = { head, tail };
	return operations[operation];
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

const checkHeadErrors = function(option, count, fileNames) {
	if (isZero(count) || fileNames.includes('-0')) {
		return 'head: illegal line count -- 0';
	}

	if (hasInvalidCount(count)) {
		return invalidCountError(option, count);
	}
};

const checkTailErrors = function(count, fileNames) {
	if (isZero(count) || fileNames.includes('-0')) {
		return ' ';
	}

	if (isNaN(count)) {
		return 'tail: illegal offset -- ' + count;
	}
};

const validateArguments = function(parameters, operation) {
	let { option, count, fileNames } = parameters;

	if (hasInvalidOption(option)) {
		return invalidOptionError(option, operation);
	}
	if (operation == 'head') {
		return checkHeadErrors(option, count, fileNames);
	}
	return checkTailErrors(count, fileNames);
};

const fileNotFoundError = function(file, operation) {
	return operation + ': ' + file + ': No such file or directory';
};

module.exports = {
	validateArguments,
	checkHeadErrors,
	checkTailErrors,
	fileNotFoundError,
	isZero,
	hasInvalidOption,
	hasInvalidCount,
	invalidCountError,
	invalidOptionError
};
