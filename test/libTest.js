const assert = require('assert');
const {
	isValidFile,
	fetchRequiredContent,
	getMultipleFileContent,
	getFileContent,
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
let actualOutput;

describe('Head function with single file', function() {
	it('should return the first ten lines of file when count is not specified', function() {
		actualOutput = head({ count: 10, option: 'n', fileNames: ['numbers'] }, fs);
		expectedOutput =
			'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when only count is given', function() {
		actualOutput = head({ count: 3, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'One\nTwo\nThree';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		actualOutput = head({ count: 2, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'One\nTwo';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		actualOutput = head({ count: 1, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'One';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		actualOutput = head({ count: 3, fileNames: ['numbers'], option: 'c' }, fs);
		expectedOutput = 'One';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		actualOutput = head({ count: 6, fileNames: ['numbers'], option: 'c' }, fs);
		expectedOutput = 'One\nTw';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('Head function with multiple file', function() {
	let expectedOutput;

	it('should return the first ten lines of file when count is not specified', function() {
		actualOutput = head(
			{ count: 10, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen\n\n==> digits <==\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when only count is given', function() {
		actualOutput = head(
			{ count: 3, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\n\n==> digits <==\n0\n1\n2';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		actualOutput = head(
			{ count: 2, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput = '==> numbers <==\nOne\nTwo\n\n==> digits <==\n0\n1';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		actualOutput = head(
			{ count: 1, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput = '==> numbers <==\nOne\n\n==> digits <==\n0';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		actualOutput = head(
			{ count: 3, fileNames: ['numbers', 'digits'], option: 'c' },
			fs
		);
		expectedOutput = '==> numbers <==\nOne\n\n==> digits <==\n0\n1';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		actualOutput = head(
			{ count: 3, fileNames: ['numbers', 'digits'], option: 'c' },
			fs
		);
		expectedOutput = '==> numbers <==\nOne\n\n==> digits <==\n0\n1';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('Head function errors handling', function() {
	let expectedOutput;

	it('should return the error message when number of lines is given zero with n without spaces', function() {
		actualOutput = head({ count: 0, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when is count is given zero only without -c or -n', function() {
		actualOutput = head({ count: 0, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when count is given zero only without -c or -n', function() {
		actualOutput = head(
			{ count: 0, fileNames: ['-0', 'numbers'], option: 'n' },
			fs
		);
		expectedOutput = 'head: illegal line count -- 0';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when  is count is invalid with -c or -n', function() {
		actualOutput = head(
			{ count: -12, fileNames: ['numbers', 'numbers'], option: 'n' },
			fs
		);
		expectedOutput = 'head: illegal line count -- -12';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when file is not present in the directory', function() {
		actualOutput = head(
			{ count: 3, fileNames: ['README.mdafs', 'numbers'], option: 'n' },
			fs
		);
		expectedOutput =
			'head: README.mdafs: No such file or directory\n==> numbers <==\nOne\nTwo\nThree';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		actualOutput = head(
			{ count: 3, fileNames: ['numbers', 'numbers'], option: 'x' },
			fs
		);
		expectedOutput =
			'head: illegal option -- x\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when option other than -c or -n is given ', function() {
		actualOutput = head(
			{ count: 10, fileNames: ['numbers', 'numbers'], option: 'z' },
			fs
		);
		expectedOutput =
			'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it("should return the error message when option is correct but only one file which doesn't  exist is given", function() {
		actualOutput = head(
			{ count: 10, fileNames: ['README.mdafs'], option: 'n' },
			fs
		);
		expectedOutput = 'head: README.mdafs: No such file or directory';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the error message when -n or -c and then alphanumeric combination is given ', function() {
		actualOutput = head(
			{ count: 'u922', fileNames: ['README.mdafs'], option: 'n' },
			fs
		);
		expectedOutput = 'head: illegal line count -- u922';
		assert.deepEqual(actualOutput, expectedOutput);

		(actualOutput = head(
			{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'c' },
			fs
		)),
			(expectedOutput = 'head: illegal byte count -- u922');
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('Tail function with single file', function() {
	it('should return the first ten lines of file when count is not specified', function() {
		actualOutput = tail({ count: 10, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput =
			'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when only count is given', function() {
		actualOutput = tail({ count: 3, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		actualOutput = tail({ count: 2, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'Nine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		actualOutput = tail({ count: 1, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'Ten';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		actualOutput = tail({ count: 3, fileNames: ['numbers'], option: 'c' }, fs);
		expectedOutput = 'Ten';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		actualOutput = tail({ count: 6, fileNames: ['numbers'], option: 'c' }, fs);
		expectedOutput = 'ne\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('Tail function with multiple file', function() {
	let expectedOutput;

	it('should return the first ten lines of file when count is not specified', function() {
		actualOutput = tail(
			{ count: 10, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput =
			'==> numbers <==\nOne\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen\n\n==> digits <==\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when only count is given', function() {
		actualOutput = tail(
			{ count: 3, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput =
			'==> numbers <==\nEight\nNine\nTen\n\n==> digits <==\n7\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given without spaces', function() {
		actualOutput = tail(
			{ count: 2, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput = '==> numbers <==\nNine\nTen\n\n==> digits <==\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of lines when count and option is given with spaces', function() {
		actualOutput = tail(
			{ count: 1, fileNames: ['numbers', 'digits'], option: 'n' },
			fs
		);
		expectedOutput = '==> numbers <==\nTen\n\n==> digits <==\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given with spaces', function() {
		actualOutput = tail(
			{ count: 3, fileNames: ['numbers', 'digits'], option: 'c' },
			fs
		);
		expectedOutput = '==> numbers <==\nTen\n\n==> digits <==\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the given number of characters when count is given without spaces', function() {
		actualOutput = tail(
			{ count: 6, fileNames: ['numbers', 'digits'], option: 'c' },
			fs
		);
		expectedOutput = '==> numbers <==\nne\nTen\n\n==> digits <==\n\n7\n8\n9';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('Tail function errors handling', function() {
	let expectedOutput;

	it('should return the string with one space when number of lines is given zero with n without spaces', function() {
		actualOutput = tail(
			{ count: 0, fileNames: ['numbers', 'numbers'], option: 'n' },
			fs
		);
		assert.deepEqual(actualOutput, ' ');
	});

	it('should return the lines if negative count is specified', function() {
		actualOutput = tail({ count: -1, fileNames: ['numbers'], option: 'n' }, fs);
		expectedOutput = 'Ten';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return the string with one space when  is count is given zero only without -c or -n', function() {
		actualOutput = tail(
			{ count: 0, fileNames: ['numbers', 'numbers'], option: 'n' },
			fs
		);
		assert.deepEqual(actualOutput, ' ');
	});

	it('should return the error message when  file is not present in the directory', function() {
		actualOutput = tail(
			{ count: 3, fileNames: ['README.mdafs', 'numbers'], option: 'n' },
			fs
		);
		expectedOutput =
			'tail: README.mdafs: No such file or directory\n==> numbers <==\nEight\nNine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
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
		actualOutput = tail({ count: 10, fileNames: ['numbers'], option: 'z' }, fs);
		expectedOutput =
			'tail: illegal option -- z\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it("should return the error message when option is correct but only one file which doesn't exist is given", function() {
		expectedOutput = 'tail: README.mdafs: No such file or directory';
		assert.deepEqual(
			tail({ count: 3, fileNames: ['README.mdafs'], option: 'n' }, fs),
			expectedOutput
		);
	});

	it('should return the error message when -n or -c and then alphanumeric combination is given ', function() {
		actualOutput = tail(
			{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'n' },
			fs
		);
		expectedOutput = 'tail: illegal offset -- u922';
		assert.deepEqual(actualOutput, expectedOutput);

		actualOutput = tail(
			{ count: 'u922', fileNames: ['README.mdafs', 'numbers'], option: 'c' },
			fs
		);
		expectedOutput = 'tail: illegal offset -- u922';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('getFileContent', function() {
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return when operation tail is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines'] };
			expectedOutput = 'Perpendicular Lines.';
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), expectedOutput);

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return lines when operation head is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'One');

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'One\nTwo\nThree';
			assert.deepEqual(getFileContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified with operation tail', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), 'n');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), 'Ten');
		});

		it('should return characters when option(-c) and count is specified with operation head', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'O');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'One');
		});
	});

	describe('should return formatted fileNames with their contents for multiple fileNames', function() {
		it('should return when option(-n) and count is specified', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines', 'numbers'] };
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			inputData = { count: 3, option: 'c', fileNames: ['lines', 'numbers'] };
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), expectedOutput);
		});
	});

	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return when operation tail is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines'] };
			assert.deepEqual(
				getFileContent(inputData, fs, 'tail'),
				'Perpendicular Lines.'
			);

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), expectedOutput);
		});

		it('should return lines when operation head is specified with count and option(-n)', function() {
			inputData = { count: 1, option: 'n', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'One');

			inputData = { count: 3, option: 'n', fileNames: ['numbers'] };
			expectedOutput = 'One\nTwo\nThree';
			assert.deepEqual(getFileContent(inputData, fs, 'head'), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified with operation tail', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), 'n');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'tail'), 'Ten');
		});

		it('should return characters when option(-c) and count is specified with operation head', function() {
			inputData = { count: 1, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'O');

			inputData = { count: 3, option: 'c', fileNames: ['numbers'] };
			assert.deepEqual(getFileContent(inputData, fs, 'head'), 'One');
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

	it('should create a head line when no file name is given', function() {
		assert.deepEqual(generateHeader(), '==> undefined <==\n');
	});
});

describe('fetchRequiredContent', function() {
	let numbers = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
	it('should return head content when -n is given as option', function() {
		actualOutput = fetchRequiredContent(numbers, 'n', 3, 'head');
		expectedOutput = 'One\nTwo\nThree';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return tail content when -c is given as option', function() {
		actualOutput = fetchRequiredContent(numbers, 'c', 3, 'tail');
		expectedOutput = 'Ten';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return tail content when -n is given as option', function() {
		actualOutput = fetchRequiredContent(numbers, 'n', 3, 'tail');
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(actualOutput, expectedOutput);
	});

	it('should return head content when -c is given as option', function() {
		actualOutput = fetchRequiredContent(numbers, 'c', 3, 'head');
		expectedOutput = 'One';
		assert.deepEqual(actualOutput, expectedOutput);
	});
});

describe('getMultipleFileData', function() {
	describe('should return formatted fileNames with their contents for multiple fileNames', function() {
		it('should return when option(-n) and count is specified', function() {
			inputData = { count: 1, option: 'n', fileNames: ['lines', 'numbers'] };
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			assert.deepEqual(
				getMultipleFileContent(inputData, fs, 'tail'),
				expectedOutput
			);
		});

		it('should return when option(-c) and count is specified', function() {
			inputData = { count: 3, option: 'c', fileNames: ['lines', 'numbers'] };
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			assert.deepEqual(
				getMultipleFileContent(inputData, fs, 'tail'),
				expectedOutput
			);
		});

		it('should return error message for the file if the file is not exist', function() {
			inputData = { count: 3, option: 'c', fileNames: ['abc', 'numbers'] };
			expectedOutput =
				'head: abc: No such file or directory\n==> numbers <==\nOne';
			assert.deepEqual(
				getMultipleFileContent(inputData, fs, 'head'),
				expectedOutput
			);
		});
	});
});
