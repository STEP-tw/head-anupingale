const hasValidLength = function(args) {
	return args.length > 2 && hasDash(args);
};

const hasValidOption = function(option) {
	return option[1].match(/[A-z]/) && option.length == 2;
};

const hasDash = function(option) {
	return option.startsWith('-');
};

const createArgsObject = function(option, count, fileNames) {
	return { option, count, fileNames };
};

const parse = function(args) {
	let optionCandidate = args[0];
	if (hasDash(optionCandidate) && !isNaN(optionCandidate)) {
		return createArgsObject('n', Math.abs(optionCandidate), args.slice(1));
	}
	if (hasDash(optionCandidate) && hasValidOption(optionCandidate)) {
		return createArgsObject(optionCandidate[1], args[1], args.slice(2));
	}
	if (hasValidLength(optionCandidate)) {
		return createArgsObject(
			optionCandidate[1],
			optionCandidate.slice(2),
			args.slice(1)
		);
	}
	return { option: 'n', count: 10, fileNames: args };
};

module.exports = {
	parse,
	hasValidOption,
	hasDash,
	createArgsObject
};
