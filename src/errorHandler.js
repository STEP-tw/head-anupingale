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

const validateArguments = function(parameters, operation) {
	let { option, count, fileNames } = parameters;

	if (hasInvalidOption(option)) {
		return invalidOptionError(option, operation);
	}
	if ((operation == 'head' && isZero(count)) || fileNames.includes('-0')) {
		return 'head: illegal line count -- 0';
	}

	if (operation == 'head' && hasInvalidCount(count)) {
		return invalidCountError(option, count);
	}

	if (operation == 'head' && hasInvalidOption(option)) {
		return invalidOptionError(option.slice(1));
	}

	if (operation == 'tail' && (isZero(count) || fileNames.includes('-0'))) {
		return ' ';
	}

	if (operation == 'tail' && isNaN(count)) {
		return 'tail: illegal offset -- ' + count;
	}
};

const displayFileNotFoundError = function(file, operation) {
	return operation + ': ' + file + ': No such file or directory';
};

module.exports = {
	validateArguments,
	displayFileNotFoundError,
	isZero,
	hasInvalidOption,
	hasInvalidCount,
	invalidCountError,
	invalidOptionError
};
