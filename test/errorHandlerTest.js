const assert = require('assert');
const {
	validateHeadArguments,
	displayFileNotFoundError,
	validateTailArguments,
	isZero,
	hasInvalidOption,
	invalidCountError,
	invalidOptionError,
	hasInvalidCount
} = require('../src/errorHandler.js');

describe('validateHeadArguments', function() {
	it('should return false if count is 0', function() {
		assert.deepEqual(
			validateHeadArguments({
				option: 'n',
				count: '0',
				fileNames: ['numbers']
			}),
			'head: illegal line count -- 0'
		);
	});

	it('should return error if count is invalid', function() {
		inputData = { option: 'n', count: '-0', fileNames: ['numbers'] };
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(validateHeadArguments(inputData), expectedOutput);
	});

	it('should return error when option is invalid', function() {
		expectedOutput =
			'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(
			validateHeadArguments({ option: 'z', count: '10', fileNames: ['abc'] }),
			expectedOutput
		);
	});
});

describe('isZero', function() {
	it('should return true if the value is zero', function() {
		assert.deepEqual(isZero(0), true);
	});

	it('should return false if the value is nonZero', function() {
		assert.deepEqual(isZero(2), false);
	});
});

describe('invalidCountError', function() {
	it('should return invalid line count if option is n', function() {
		expectedOutput = 'head: illegal line count -- 5';
		assert.deepEqual(invalidCountError('n', 5), expectedOutput);
	});

	it('should return invalid byte count if option is c', function() {
		expectedOutput = 'head: illegal byte count -- 5';
		assert.deepEqual(invalidCountError('c', 5), expectedOutput);
	});
});
describe('hasInvalidOption', function() {
	it('should return true if has chracters except options', function() {
		assert.deepEqual(hasInvalidOption('z'), true);
	});

	it('should return false if has option', function() {
		assert.deepEqual(hasInvalidOption('n'), false);
	});
});

describe('validateTailArguments', function() {
	it('should treat zero as valid count', function() {
		inputData = { option: 'n', count: '0', fileNames: ['numbers'] };
		assert.deepEqual(validateTailArguments(inputData), ' ');
	});

	it('should return error if count is not a number', function() {
		inputData = { option: 'n', count: 'a', fileNames: ['numbers'] };
		expectedOutput = 'tail: illegal offset -- a';
		assert.deepEqual(validateTailArguments(inputData), expectedOutput);
	});

	it('should return illegal offset error if count is invalid', function() {
		inputData = { option: 'n', count: '10u', fileNames: ['numbers'] };
		expectedOutput = 'tail: illegal offset -- 10u';
		assert.deepEqual(validateTailArguments(inputData), expectedOutput);
	});

	it('should return illegal option error when option is invalid', function() {
		inputData = { option: 'z', count: '10u', fileNames: ['numbers'] };
		expectedOutput =
			'tail: illegal option -- zusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(validateTailArguments(inputData), expectedOutput);
	});
});

describe('hasInvalidCount', function() {
	it('should return true if count is not a number or less than 1', function() {
		assert.deepEqual(hasInvalidCount('10u'), true);
	});

	it('should return false if count is a number number and greater than 1 ', function() {
		assert.deepEqual(hasInvalidCount(5), false);
	});
});

describe('invalidOptionError', function() {
	it('should return error when invalid option is specified', function() {
		expectedOutput =
			'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(invalidOptionError('z', 'head'), expectedOutput);
	});

	it('should return error when invalid option is specified', function() {
		expectedOutput =
			'tail: illegal option -- zusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(invalidOptionError('z', 'tail'), expectedOutput);
	});
});

describe('displayFileNotFoundError', function() {
	it('should return file not found message with file name', () => {
		assert.deepEqual(
			displayFileNotFoundError('myFile.txt', 'head'),
			'head: myFile.txt: No such file or directory'
		);
		assert.deepEqual(
			displayFileNotFoundError('123.txt', 'head'),
			'head: 123.txt: No such file or directory'
		);
	});

	it('should return file not found message with file name', () => {
		assert.deepEqual(
			displayFileNotFoundError('myFile.txt', 'tail'),
			'tail: myFile.txt: No such file or directory'
		);
		assert.deepEqual(
			displayFileNotFoundError('123.txt', 'tail'),
			'tail: 123.txt: No such file or directory'
		);
	});
});
