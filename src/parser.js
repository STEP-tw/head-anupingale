const hasValidLength = function(args) {
	return args.length > 2 && hasDash(args);
};

const hasValidOption = function(givenOption) {
	let isNotAlphabet = !givenOption[1].match(/[A-z]/);
	let length = givenOption.length;
	return !isNotAlphabet && length == 2;
};

const hasDash = function(option) {
	return option.startsWith('-');
};

const createObject = function(option, count, fileNames) {
	return { option, count, fileNames };
};

const parse = function(args) {
	if (args[0].startsWith('-') && !isNaN(args[0])) {
		return createObject('n', Math.abs(args[0]), args.slice(1));
	}
	if (hasValidOption(args[0])) {
		return createObject(args[0][1], args[1], args.slice(2));
	}
	if (hasValidLength(args[0])) {
		return createObject(args[0].slice(1, 2), args[0].slice(2), args.slice(1));
	}
	return { option: 'n', count: 10, fileNames: args };
};

module.exports = {
	parse,
	hasValidOption,
	hasDash,
	createObject
};
