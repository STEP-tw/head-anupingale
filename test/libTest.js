const assert = require('assert');
const {
	getContent,
	head,
	isValidSingleFile,
	getHeadContent,
	getTailContent,
	tail,
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

describe('head', function() {
	describe('Default option and count', function() {
		it('should return 10 lines By default if option and count is not specified', function() {
			expectedOutput =
				'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
			assert.deepEqual(head(['numbers'], fs), expectedOutput);
		});
	});

	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return lines when option(-n) and count are not seperated by space', function() {
			assert.deepEqual(
				head(['-n1', 'lines'], fs),
				'There are 5 types of lines:'
			);

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			assert.deepEqual(head(['-n3', 'lines'], fs), expectedOutput);
		});

		it('should return lines when option(-n) and count is seperated by spaces', function() {
			assert.deepEqual(
				head(['-n', '1', 'lines'], fs),
				'There are 5 types of lines:'
			);

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			assert.deepEqual(head(['-n', '3', 'lines'], fs), expectedOutput);
		});

		it('should return lines when only count is specified', function() {
			assert.deepEqual(
				head(['-1', 'lines'], fs),
				'There are 5 types of lines:'
			);

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			assert.deepEqual(head(['-3', 'lines'], fs), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified', function() {
			assert.deepEqual(head(['-c1', 'lines'], fs), 'T');

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			assert.deepEqual(head(['-c3', 'lines'], fs), 'The');
		});

		it('should return characters when option(-c) and count is seperated by spaces', function() {
			assert.deepEqual(head(['-c', '1', 'lines'], fs), 'T');
			assert.deepEqual(head(['-c', '3', 'lines'], fs), 'The');
		});
	});

	describe('should return formatted fileName with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			expectedOutput =
				'==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:';
			assert.deepEqual(head(['-n1', 'lines', 'lines'], fs), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			expectedOutput = '==> lines <==\nThe\n\n==> lines <==\nThe';
			assert.deepEqual(head(['-c', '3', 'lines', 'lines'], fs), expectedOutput);
		});
	});

	describe('error messages', function() {
		it('should return error when invalid option is specified', function() {
			expectedOutput = 'head: illegal line count -- 0';
			assert.deepEqual(head(['-n0', 'lines'], fs), expectedOutput);
		});

		it('should return error when -0 is given as count', function() {
			expectedOutput = 'head: illegal line count -- 0';
			assert.deepEqual(head(['-0', 'lines'], fs), expectedOutput);
		});

		describe('should return error when count is invalid', function() {
			it('should return illegal line count when option is(-n) and invalid count', function() {
				expectedOutput = 'head: illegal line count -- -10';
				assert.deepEqual(head(['-n-10', 'lines'], fs), expectedOutput);
			});

			it('should return illegal byte count when option is(-n) and invalid count', function() {
				expectedOutput = 'head: illegal byte count -- -10';
				assert.deepEqual(head(['-c-10', 'lines'], fs), expectedOutput);
			});
		});

		it('should return error when invalid option is speciified', function() {
			expectedOutput =
				'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
			assert.deepEqual(head(['-z', 'lines'], fs), expectedOutput);
		});

		it('should return error if file not exits', function() {
			expectedOutput = 'head: abc: No such file or directory';
			assert.deepEqual(head(['-c10', 'abc'], fs), expectedOutput);
		});

		it('should return illegal byte count when count is not a number', function() {
			expectedOutput = 'head: illegal byte count -- 10u';
			assert.deepEqual(head(['-c10u', 'file2'], fs), expectedOutput);
		});
	});

	describe('should return error when count is invalid and having characters in it', function() {
		it('should return invalid line count when option(-n) and invalid count', function() {
			expectedOutput = 'head: illegal line count -- 10u';
			assert.deepEqual(head(['-n10u', 'lines'], fs), expectedOutput);
		});

		it('should return invalid byte count when option(-c) and invalid count', function() {
			expectedOutput = 'head: illegal byte count -- 10u';
			assert.deepEqual(head(['-c10u', 'lines'], fs), expectedOutput);
		});
	});
});

describe('tail', function() {
	describe('Default option and count', function() {
		it('should return 10 lines By default if option and count is not specified', function() {
			expectedOutput =
				'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
			assert.deepEqual(tail(['numbers'], fs), expectedOutput);
		});

		it('should return error when invalid option is specified', function() {
			expectedOutput =
				'tail: illegal option -- z\nusage: tail [-n lines | -c bytes] [file ...]';
			assert.deepEqual(tail(['-z', 'lines'], fs), expectedOutput);
		});
	});

	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return lines when option(-n) and count are not seperated by space', function() {
			assert.deepEqual(tail(['-n1', 'lines'], fs), 'Perpendicular Lines.');

			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(tail(['-n3', 'numbers'], fs), expectedOutput);
		});

		it('should return lines when option(-n) and count is seperated by spaces', function() {
			assert.deepEqual(tail(['-n', '1', 'numbers'], fs), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(tail(['-n', '3', 'numbers'], fs), expectedOutput);
		});

		it('should return lines when only count is specified', function() {
			assert.deepEqual(tail(['-1', 'numbers'], fs), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			assert.deepEqual(tail(['-3', 'numbers'], fs), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified', function() {
			assert.deepEqual(tail(['-c1', 'numbers'], fs), 'n');

			assert.deepEqual(tail(['-c3', 'numbers'], fs), 'Ten');
		});

		it('should return characters when option(-c) and count is seperated by spaces', function() {
			assert.deepEqual(tail(['-c', '1', 'numbers'], fs), 'n');
			assert.deepEqual(tail(['-c', '3', 'numbers'], fs), 'Ten');
		});
	});

	describe('should return formatted fileName with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			assert.deepEqual(tail(['-n1', 'lines', 'numbers'], fs), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			assert.deepEqual(
				tail(['-c', '3', 'lines', 'numbers'], fs),
				expectedOutput
			);
		});
	});

	describe('should return error when count is invalid and having characters in it', function() {
		it('should return illegal when option(-n) and invalid count', function() {
			expectedOutput = 'tail: illegal offset -- 10u';
			assert.deepEqual(tail(['-n10u', 'lines'], fs), expectedOutput);
		});
	});

	it('should return error if file not exits', function() {
		expectedOutput = 'tail: abc: No such file or directory';
		assert.deepEqual(tail(['-c10', 'abc'], fs), expectedOutput);
	});

	it('should return illegal byte count when count is not a number', function() {
		expectedOutput = 'tail: illegal offset -- 10u';
		assert.deepEqual(tail(['-c10u', 'file2'], fs), expectedOutput);
	});

	it('should return nothing when input is zero', function() {
		assert.deepEqual(tail(['-n0', 'lines'], fs), '');
	});

	it('should return nothing when input is -0', function() {
		assert.deepEqual(tail(['-0', 'lines'], fs), '');
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

describe('getHeadContent', function() {
	let numbers = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
	it('should return head content when -n is given as option', function() {
		expectedOutput = 'One\nTwo\nThree';
		assert.deepEqual(getHeadContent(numbers, 3, 'n'), expectedOutput);
	});

	it('should return head content when -c is given as option', function() {
		expectedOutput = 'One';
		assert.deepEqual(getHeadContent(numbers, 3, 'c'), expectedOutput);
	});
});

describe('getTailContent', function() {
	let numbers = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
	it('should return head content when -n is given as option', function() {
		expectedOutput = 'Eight\nNine\nTen';
		assert.deepEqual(getTailContent(numbers, 3, 'n'), expectedOutput);
	});

	it('should return head content when -c is given as option', function() {
		expectedOutput = 'Ten';
		assert.deepEqual(getTailContent(numbers, 3, 'c'), expectedOutput);
	});
});
