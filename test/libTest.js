const assert = require('assert');
const {
	getContent,
	isValidSingleFile,
	getSpecifiedContent,
	fetchContent,
	generateHeader
} = require('../src/lib.js');

const readFileSync = function(fileName) {
	let files = {
		lines:
			'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.',
		numbers: 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen',
		lineData:
			'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.',
		digits: '0\n1\n2\n3\n4\n5\n6\n7\n8\n9'
	};
	return files[fileName];
};

const existsSync = function(fileName) {
	let files = ['lines', 'numbers', 'lineData', 'digits'];
	return files.includes(fileName);
};

const fs = { existsSync, readFileSync };

let expectedOutput;
let inputData;

describe('getContent', function() {
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return when operation tail is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines'] };
			assert.deepEqual(
				getContent(inputData, fs, 'tail'),
				'Perpendicular Lines.'
			);

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(getContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return lines when operation head is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['numbers'] };
			assert.deepEqual(getContent(inputData, fs, 'head'), 'One');

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'One\nTwo\nThree';
			assert.deepEqual(getContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified with operation tail', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getContent(inputData, fs, 'tail'), 'n');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getContent(inputData, fs, 'tail'), 'Ten');
		});

		it('should return characters when option(-c) and count is specified with operation head', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getContent(inputData, fs, 'head'), 'O');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getContent(inputData, fs, 'head'), 'One');
		});
	});

	describe('should return formatted fileNames with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines', 'numbers'] };
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			assert.deepEqual(getContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			inputData = { count: 3, option: 'c', fileNames: ['lines', 'numbers'] };
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			assert.deepEqual(getContent(inputData, fs, 'tail'), expectedOutput);
		});
	});
});

describe('singleValidFile', function() {
	it('should return true if it has a single file', function() {
		assert.deepEqual(isValidSingleFile(['numbers'], existsSync), true);
	});

	it('should return false if it has more than one file', function() {
		assert.deepEqual(isValidSingleFile(['abc', 'numbers'], existsSync), false);
	});
});

describe('generateHeader', function() {
	it('should create a head line using a file name', function() {
		assert.deepEqual(generateHeader('lib.js'), '==> lib.js <==\n');
		assert.deepEqual(
			generateHeader('createHead.js'),
			'==> createHead.js <==\n'
		);
	});

	it('should create a head line when file name is empty', function() {
		assert.deepEqual(generateHeader(''), '==>  <==\n');
	});

	it('should create a head line when no file name is given', function() {
		assert.deepEqual(generateHeader(), '==> undefined <==\n');
	});
});

describe('getSpecifiedContent', function() {
	let numbers = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
	it('should return head content when -n is given as option', function() {
		expectedOutput = 'One\nTwo\nThree';
		assert.deepEqual(
			getSpecifiedContent(numbers, 'n', 3, 'head'),
			expectedOutput
		);
	});

	it('should return tail content when -c is given as option', function() {
		expectedOutput = 'Ten';
		assert.deepEqual(
			getSpecifiedContent(numbers, 'c', 3, 'tail'),
			expectedOutput
		);
	});

	it('should return tail content when -n is given as option', function() {
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(
			getSpecifiedContent(numbers, 'n', 3, 'tail'),
			expectedOutput
		);
	});

	it('should return head content when -c is given as option', function() {
		expectedOutput = 'One';
		assert.deepEqual(
			getSpecifiedContent(numbers, 'c', 3, 'head'),
			expectedOutput
		);
	});
});

describe('fetchContent', function() {
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return when operation tail is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines'] };
			assert.deepEqual(
				fetchContent(inputData, fs, 'tail'),
				'Perpendicular Lines.'
			);

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return lines when operation head is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['numbers'] };
			assert.deepEqual(fetchContent(inputData, fs, 'head'), 'One');

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'One\nTwo\nThree';
			assert.deepEqual(fetchContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified with operation tail', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), 'n');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), 'Ten');
		});

		it('should return characters when option(-c) and count is specified with operation head', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(fetchContent(inputData, fs, 'head'), 'O');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(fetchContent(inputData, fs, 'head'), 'One');
		});
	});

	describe('should return formatted fileNames with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines', 'numbers'] };
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			inputData = { count: 3, option: 'c', fileNames: ['lines', 'numbers'] };
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});
	});

	describe('it should return error if file name is invalid', function() {
		it('should return error if file is not present', function() {
			inputData = { count: 3, option: 'n', fileNames: ['abc'] };
			expectedOutput = 'head: abc: No such file or directory';
			assert.deepEqual(fetchContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return error if file is not present', function() {
			inputData = { count: '3', option: 'n', fileNames: ['abc'] };
			expectedOutput = 'tail: abc: No such file or directory';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});
	});

	describe('invalid option errors', function() {
		it('should return invalid option error if invalid option is specified', function() {
			inputData = { count: '3', option: 'z', fileNames: ['abc'] };
			expectedOutput =
				'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
			assert.deepEqual(fetchContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return invalid option error if invalid option is specified', function() {
			inputData = { count: '3', option: 'z', fileNames: ['abc'] };
			expectedOutput =
				'tail: illegal option -- z\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});
	});

	describe('invalid count error', function() {
		it('should return invalid count error if invalid count is specified', function() {
			inputData = { count: '-10', option: 'n', fileNames: ['abc'] };
			expectedOutput = 'head: illegal line count -- -10';
			assert.deepEqual(fetchContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return invalid count error if invalid count is specified', function() {
			inputData = { count: '-10u', option: 'n', fileNames: ['abc'] };
			expectedOutput = 'head: illegal line count -- -10u';
			assert.deepEqual(fetchContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return invalid count error if invalid count is specified', function() {
			inputData = { count: '-10u', option: 'n', fileNames: ['abc'] };
			expectedOutput = 'tail: illegal offset -- -10u';
			assert.deepEqual(fetchContent(inputData, fs, 'tail'), expectedOutput);
		});
	});
});
