const parseInput = function(args) {
	let defaultParameters = { option: 'n', count: 10, files: args};
	if (hasOption(args[0])) {
		return {
			option: args[0][1],
			count: parseInt(args[1]),
			files: args.slice(2)
		};
	}
	if (hasValidLength(args[0])) {
	  return {
			option: args[0].slice(1, 2),
			count: args[0].slice(2),
			files: args.slice(1)
		};
	}
	if (parseInt(args[0])) {
		return {
			option: 'n',
			count: Math.abs(args[0]),
			files: args.slice(1)
		};
	}
	return defaultParameters;
};

const hasValidLength = function(args) {
  return args.length > 2 && hasDash(args);
}

const hasOption = function(option) {
	return option == '-c' || option == '-n';
};

const hasDash = function(option) {
	return option.includes('-');
};

module.exports = { parseInput, hasOption, hasDash };
