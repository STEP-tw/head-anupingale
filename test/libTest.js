const assert = require('assert');
const {
	isValidFile,
	fetchRequiredContent,
	getContent,
	head,
	tail,
	generateHeader
} = require('../src/lib.js');

const readFileSync = function(fileName) {
	let fileNames = {
		lines:
			'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.',
		numbers: 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen',
		digits: '0\n1\n2\n3\n4\n5\n6\n7\n8\n9'
	};
	return fileNames[fileName];
};

const existsSync = function(fileName) {
	let fileNames = ['numbers', 'lines', 'digits'];
	return fileNames.includes(fileName);
};

const fs = { existsSync, readFileSync };

let expectedOutput;
let inputData;

describe('Head function with single file', function() {
	it('should return the first ten lines of file when count is not specified', function() {
		assert.deepEqual(
			head({ count: 10, option: 'n', fileNames: ['numbers'] }, fs),
			'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen'
		);
	});

	it('should return the given number of lines when only count is given', function() {
		assert.deepEqual(
			head({ count: 3, fileNames: ['numbers'], option: 'n' }, fs),
			'One\nTwo\nThree'
		);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		assert.deepEqual(
			head({ count: 2, fileNames: ['numbers'], option: 'n' }, fs),
			'One\nTwo'
		);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		assert.deepEqual(
			head({ count: 1, fileNames: ['numbers'], option: 'n' }, fs),
			'One'
		);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		assert.deepEqual(
			head({ count: 3, fileNames: ['numbers'], option: 'c' }, fs),
			'One'
		);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		assert.deepEqual(
			head({ count: 6, fileNames: ['numbers'], option: 'c' }, fs),
			'One\nTw'
		);
	});
});

describe('Head function with multiple file', function() {
	let expectedOutput;

	it('should return the first ten lines of file when count is not specified', function() {
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen\n\n==> digits <==\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
		assert.deepEqual(
			head({ count: 10, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when only count is given', function() {
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\n\n==> digits <==\n0\n1\n2';
		assert.deepEqual(
			head({ count: 3, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		expectedOutput = '==> numbers <==\nOne\nTwo\n\n==> digits <==\n0\n1';
		assert.deepEqual(
			head({ count: 2, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		expectedOutput = '==> numbers <==\nOne\n\n==> digits <==\n0';
		assert.deepEqual(
			head({ count: 1, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		expectedOutput = '==> numbers <==\nOne\n\n==> digits <==\n0\n1';
		assert.deepEqual(
			head({ count: 3, fileNames: ['numbers', 'digits'], option: 'c' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		expectedOutput = '==> numbers <==\nOne\nTw\n\n==> digits <==\n0\n1\n2\n';
		assert.deepEqual(
			head({ count: 6, fileNames: ['numbers', 'digits'], option: 'c' }, fs),
			expectedOutput
		);
	});
});

describe('Head function errors handling', function() {
	let expectedOutput;

	it('should return the error message when number of lines is given zero with n without spaces', function() {
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(
			head({ count: 0, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when  is count is given zero only without -c or -n', function() {
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(
			head({ count: 0, fileNames: ['numbers', 'numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when  is count is given zero only without -c or -n', function() {
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(
			head({ count: 0, fileNames: ['0', 'numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when  is count is invalid with -c or -n', function() {
		expectedOutput = 'head: illegal line count -- -12';
		assert.deepEqual(
			head({ count: -12, fileNames: ['numbers', 'numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when  file is not present in the directory', function() {
		expectedOutput =
			'head: README.mdafs: No such file or directory\n==> numbers <==\nOne\nTwo\nThree';
		assert.deepEqual(
			head(
				{ count: 3, fileNames: ['README.mdafs', 'numbers'], option: 'n' },
				fs
			),
			expectedOutput
		);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		expectedOutput =
			'head: illegal option -- x\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(
			head({ count: 3, fileNames: ['numbers', 'numbers'], option: 'x' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		expectedOutput =
			'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(
			head({ count: 10, fileNames: ['numbers', 'numbers'], option: 'z' }, fs),
			expectedOutput
		);
	});

	it("should return the error message when option is correct but only one file which doesn't exist is given", function() {
		expectedOutput = 'head: README.mdafs: No such file or directory';
		assert.deepEqual(
			head({ count: 10, fileNames: ['README.mdafs'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when -n or -c and then alphanumeric combination is given ', function() {
		expectedOutput = 'head: illegal line count -- u922';
		assert.deepEqual(
			head({ count: 'u922', fileNames: ['README.mdafs'], option: 'n' }, fs),
			expectedOutput
		);

		expectedOutput = 'head: illegal byte count -- u922';
		assert.deepEqual(
			head(
				{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'c' },
				fs
			),
			expectedOutput
		);
	});
});

describe('Tail function with single file', function() {
	it('should return the first ten lines of file when count is not specified', function() {
		expectedOutput =
			'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
		assert.deepEqual(
			tail({ count: 10, fileNames: ['numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when only count is given', function() {
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(
			tail({ count: 3, fileNames: ['numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		expectedOutput = 'Nine\nTen';
		assert.deepEqual(
			tail({ count: 2, fileNames: ['numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		expectedOutput = 'Ten';
		assert.deepEqual(
			tail({ count: 1, fileNames: ['numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		assert.deepEqual(
			tail({ count: 3, fileNames: ['numbers'], option: 'c' }, fs),
			'Ten'
		);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		assert.deepEqual(
			tail({ count: 6, fileNames: ['numbers'], option: 'c' }, fs),
			'ne\nTen'
		);
	});
});

describe('Tail function with multiple file', function() {
	let expectedOutput;

	it('should return the first ten lines of file when count is not specified', function() {
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen\n\n==> digits <==\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
		assert.deepEqual(
			tail({ count: 10, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when only count is given', function() {
		expectedOutput =
			'==> numbers <==\nEight\nNine\nTen\n\n==> digits <==\n7\n8\n9';
		assert.deepEqual(
			tail({ count: 3, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		expectedOutput = '==> numbers <==\nNine\nTen\n\n==> digits <==\n8\n9';
		assert.deepEqual(
			tail({ count: 2, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		expectedOutput = '==> numbers <==\nTen\n\n==> digits <==\n9';
		assert.deepEqual(
			tail({ count: 1, fileNames: ['numbers', 'digits'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		expectedOutput = '==> numbers <==\nTen\n\n==> digits <==\n8\n9';
		assert.deepEqual(
			tail({ count: 3, fileNames: ['numbers', 'digits'], option: 'c' }, fs),
			expectedOutput
		);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		expectedOutput = '==> numbers <==\nne\nTen\n\n==> digits <==\n\n7\n8\n9';
		assert.deepEqual(
			tail({ count: 6, fileNames: ['numbers', 'digits'], option: 'c' }, fs),
			expectedOutput
		);
	});
});

describe('Tail function errors handling', function() {
	let expectedOutput;

	it('should return the string with one space when number of lines is given zero with n without spaces', function() {
		assert.deepEqual(
			tail({ count: 0, fileNames: ['numbers', 'numbers'], option: 'n' }, fs),
			' '
		);
	});

	it('should return the lines if negative count is specified', function() {
		expectedOutput = 'Ten';
		assert.deepEqual(
			tail({ count: -1, fileNames: ['numbers'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the string with one space when  is count is given zero only without -c or -n', function() {
		assert.deepEqual(
			tail({ count: 0, fileNames: ['numbers', 'numbers'], option: 'n' }, fs),
			' '
		);
	});

	it('should return the error message when  file is not present in the directory', function() {
		expectedOutput =
			'tail: README.mdafs: No such file or directory\n==> numbers <==\nEight\nNine\nTen';
		assert.deepEqual(
			tail(
				{ count: 3, fileNames: ['README.mdafs', 'numbers'], option: 'n' },
				fs
			),
			expectedOutput
		);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		expectedOutput =
			'tail: illegal option -- x\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(
			tail(
				{ count: 3, fileNames: ['README.mdafs', 'numbers'], option: 'x' },
				fs
			),
			expectedOutput
		);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		expectedOutput =
			'tail: illegal option -- z\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(
			tail(
				{ count: 10, fileNames: ['README.mdafs', 'numbers'], option: 'z' },
				fs
			),
			expectedOutput
		);
	});

	it("should return the error message when option is correct but only one file which doesn't exist is given", function() {
		expectedOutput = 'tail: README.mdafs: No such file or directory';
		assert.deepEqual(
			tail({ count: 3, fileNames: ['README.mdafs'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when -n or -c and then alphanumeric combination is given ', function() {
		expectedOutput = 'tail: illegal offset -- u922';
		assert.deepEqual(
			tail(
				{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'n' },
				fs
			),
			expectedOutput
		);

		expectedOutput = 'tail: illegal offset -- u922';
		assert.deepEqual(
			tail(
				{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'c' },
				fs
			),
			expectedOutput
		);
	});
});

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

	describe('should return formatted fileNames with their contents for multiple fileNames', function() {
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
});

describe('isValidFile', function() {
	it('should return true if it has a single file', function() {
		assert.deepEqual(isValidFile(['numbers'], existsSync), true);
	});

	it('should return false if it has more than one file', function() {
		assert.deepEqual(isValidFile(['abc', 'numbers'], existsSync), false);
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

describe('fetchRequiredContent', function() {
	let numbers = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
	it('should return head content when -n is given as option', function() {
		expectedOutput = 'One\nTwo\nThree';
		assert.deepEqual(
			fetchRequiredContent(numbers, 'n', 3, 'head'),
			expectedOutput
		);
	});

	it('should return tail content when -c is given as option', function() {
		expectedOutput = 'Ten';
		assert.deepEqual(
			fetchRequiredContent(numbers, 'c', 3, 'tail'),
			expectedOutput
		);
	});

	it('should return tail content when -n is given as option', function() {
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(
			fetchRequiredContent(numbers, 'n', 3, 'tail'),
			expectedOutput
		);
	});

	it('should return head content when -c is given as option', function() {
		expectedOutput = 'One';
		assert.deepEqual(
			fetchRequiredContent(numbers, 'c', 3, 'head'),
			expectedOutput
		);
	});
});
