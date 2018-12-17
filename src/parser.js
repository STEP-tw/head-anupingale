const hasValidLength = function(args) {
	return args.length > 2 && hasDash(args);
};

const hasValidOption = function(option) {
	return option == '-c' || option == '-n';
};

const hasDash = function(option) {
	return option.startsWith('-');
};

const createObject = function(option, count, fileNames) {
	return { option, count, fileNames };
};

const parseInput = function(args) {
	let defaultArgs = { option: 'n', count: 10, fileNames: args };
	if (hasValidOption(args[0])) {
		return createObject(args[0][1], parseInt(args[1]), args.slice(2));
	}
	if (hasValidLength(args[0])) {
		return createObject(args[0].slice(1, 2), args[0].slice(2), args.slice(1));
	}
	if (parseInt(args[0])) {
		return createObject('n', Math.abs(args[0]), args.slice(1));
	}
	return defaultArgs;
};

module.exports = {
	parseInput,
	hasValidOption,
	hasDash,
	createObject
};
