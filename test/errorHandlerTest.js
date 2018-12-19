const assert = require('assert');
const {
	validateArguments,
	fileNotFoundError,
	checkHeadErrors,
	checkTailErrors,
	isZero,
	hasInvalidOption,
	invalidCountError,
	invalidOptionError,
	hasInvalidCount
} = require('../src/errorHandler.js');

describe('validateArguments', function() {
	it('should return false if count is 0', function() {
		assert.deepEqual(
			validateArguments(
				{
					option: 'n',
					count: '0',
					fileNames: ['numbers']
				},
				'head'
			),
			'head: illegal line count -- 0'
		);
	});

	it('should return error if count is invalid', function() {
		inputData = { option: 'n', count: '-0', fileNames: ['numbers'] };
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(validateArguments(inputData, 'head'), expectedOutput);
	});

	it('should return error when option is invalid', function() {
		expectedOutput =
			'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(
			validateArguments(
				{ option: 'z', count: '10', fileNames: ['abc'] },
				'head'
			),
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

describe('validateArguments', function() {
	it('should treat zero as valid count', function() {
		inputData = { option: 'n', count: '0', fileNames: ['numbers'] };
		assert.deepEqual(validateArguments(inputData, 'tail'), ' ');
	});

	it('should return error if count is not a number', function() {
		inputData = { option: 'n', count: 'a', fileNames: ['numbers'] };
		expectedOutput = 'tail: illegal offset -- a';
		assert.deepEqual(validateArguments(inputData, 'tail'), expectedOutput);
	});

	it('should return illegal offset error if count is invalid', function() {
		inputData = { option: 'n', count: '10u', fileNames: ['numbers'] };
		expectedOutput = 'tail: illegal offset -- 10u';
		assert.deepEqual(validateArguments(inputData, 'tail'), expectedOutput);
	});

	it('should return illegal option error when option is invalid', function() {
		inputData = { option: 'z', count: '10u', fileNames: ['numbers'] };
		expectedOutput =
			'tail: illegal option -- z\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(validateArguments(inputData, 'tail'), expectedOutput);
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
			'tail: illegal option -- z\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(invalidOptionError('z', 'tail'), expectedOutput);
	});
});

describe('fileNotFoundError', function() {
	it('should return file not found message with file name', () => {
		assert.deepEqual(
			fileNotFoundError('myFile.txt', 'head'),
			'head: myFile.txt: No such file or directory'
		);
		assert.deepEqual(
			fileNotFoundError('123.txt', 'head'),
			'head: 123.txt: No such file or directory'
		);
	});

	it('should return file not found message with file name', () => {
		assert.deepEqual(
			fileNotFoundError('myFile.txt', 'tail'),
			'tail: myFile.txt: No such file or directory'
		);
		assert.deepEqual(
			fileNotFoundError('123.txt', 'tail'),
			'tail: 123.txt: No such file or directory'
		);
	});
});

describe('checkHeadErrors', function() {
	let expectedOutput;
	let inputData;

	it('should return error when invalid count is given', function() {
		expectedOutput = 'head: illegal line count -- -3';
		assert.deepEqual(checkHeadErrors('n', -3, ['numbers']), expectedOutput);
	});

	it('should return error when invalid count is given', function() {
		expectedOutput = 'head: illegal byte count -- -3';
		assert.deepEqual(checkHeadErrors('c', -3, ['numbers']), expectedOutput);
	});

	it('should return error when count given is 0', function() {
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(checkHeadErrors('n', '-0', ['numbers']), expectedOutput);
	});
});

describe('checkTailErrors', function() {
	it('should return error when invalid count is given', function() {
		assert.deepEqual(checkTailErrors('0', ['numbers']), ' ');
	});

	it('should return error when invalid count is given', function() {
		expectedOutput = 'tail: illegal offset -- aa3';
		assert.deepEqual(checkTailErrors('aa3', ['numbers']), expectedOutput);
	});
});
