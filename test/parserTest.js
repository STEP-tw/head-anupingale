const assert = require('assert');
const {
	parse,
	hasValidOption,
	hasDash,
	createObject
} = require('../src/parser.js');

describe('parse', function() {
	describe('should seperate all arguments', function() {
		it('should give default option -n and count 10 when both are not specified', function() {
			inputData = ['lines', 'numbers'];
			expectedOutput = {
				option: 'n',
				count: 10,
				fileNames: ['lines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);
		});

		it('should give default option -n if option is not specified', function() {
			inputData = ['-5', 'typesOfLines', 'numbers'];
			expectedOutput = {
				option: 'n',
				count: 5,

				fileNames: ['typesOfLines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);
		});

		it('should seperate option and count when taken as single argument', function() {
			inputData = ['-n10', 'typesOfLines', 'numbers'];
			expectedOutput = {
				option: 'n',
				count: 10,
				fileNames: ['typesOfLines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);

			inputData = ['-c10', 'typesOfLines', 'numbers'];
			expectedOutput = {
				option: 'c',
				count: 10,
				fileNames: ['typesOfLines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);
		});

		it('should return option and count when seperated with spaces', function() {
			inputData = ['-n', 10, 'typesOfLines', 'numbers'];
			expectedOutput = {
				option: 'n',
				count: 10,
				fileNames: ['typesOfLines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);

			inputData = ['-c', 10, 'typesOfLines', 'numbers'];
			expectedOutput = {
				option: 'c',
				count: 10,
				fileNames: ['typesOfLines', 'numbers']
			};
			assert.deepEqual(parse(inputData), expectedOutput);
		});
	});
});

describe('hasValidOption', function() {
	it('should return true if option(-n) is valid', function() {
		assert.deepEqual(hasValidOption('-n'), true);
	});

	it('should return true if option(-c) is valid', function() {
		assert.deepEqual(hasValidOption('-c'), true);
	});
});

describe('hasDash', function() {
	it('should return true if the input includes dash', function() {
		assert.deepEqual(hasDash('-'), true);
	});

	it('should return false if the input has no dashes', function() {
		assert.deepEqual(hasDash(''), false);
	});
});

describe('createObject', function() {
	it('should return object with given parameters', function() {
		expectedOutput = { option: 'n', count: 3, fileNames: ['file1', 'file2'] };
		assert.deepEqual(createObject('n', 3, ['file1', 'file2']), expectedOutput);
	});

	it('should return undefined values of object if values are not specified', function() {
		expectedOutput = {
			option: undefined,
			count: undefined,
			fileNames: undefined
		};
		assert.deepEqual(createObject(), expectedOutput);
	});
});
