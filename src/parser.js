const parseInput = function(parameters) {
	let defaultParameters = { option: 'n', count: 10, fileNames: parameters};
	if (hasValidOption(parameters[0])) {
		return {
			option: parameters[0][1],
			count: parseInt(parameters[1]),
			fileNames: parameters.slice(2)
		};
	}
	if (hasValidLength(parameters[0])) {
	  return {
			option: parameters[0].slice(1, 2),
			count: parameters[0].slice(2),
			fileNames: parameters.slice(1)
		};
	}
	if (parseInt(parameters[0])) {
		return {
			option: 'n',
			count: Math.abs(parameters[0]),
			fileNames: parameters.slice(1)
		};
	}
	return defaultParameters;
};

const hasValidLength = function(parameters) {
  return parameters.length > 2 && hasDash(parameters);
}

const hasValidOption = function(option) {
	return option == '-c' || option == '-n';
};

const hasDash = function(option) {
	return option.startsWith('-');
};

module.exports = { parseInput, hasValidOption, hasDash };
