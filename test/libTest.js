const { deepEqual } = require('assert');
const {
	getContent,
	fetchMultipleFileData,
	extractHeadLines,
	extractHeadCharacters,
	head,
	isValidSingleFile,
	extractTailLines,
	extractTailCharacters,
	tail
} = require('../src/lib.js');

const typesOfLines = [
	'There are 5 types of lines:',
	'Horizontal line.',
	'Vertical line.',
	'Skew Lines.',
	'Parallel Lines.',
	'Perpendicular Lines.'
];

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
	let files = ['lines', 'numbers', 'typesOfLines', 'lineData', 'digits'];
	return files.includes(fileName);
};

const fs = { existsSync, readFileSync };
let expectedOutput;
let inputData;

describe('extractHeadLines', function() {
	it('should return empty string when typesOfLines is empty', function() {
		deepEqual(extractHeadLines([], 2), '');
	});

	it('should return single line from typesOfLines when number of line is 1', function() {
		expectedOutput = 'There are 5 types of lines:';
		deepEqual(extractHeadLines(typesOfLines, 1), expectedOutput);
	});

	it('should return specified number of lines joined with \\n ', function() {
		expectedOutput = 'There are 5 types of lines:\nHorizontal line.';
		deepEqual(extractHeadLines(typesOfLines, 2), expectedOutput);

		expectedOutput =
			'There are 5 types of lines:\nHorizontal line.\nVertical line.';
		deepEqual(extractHeadLines(typesOfLines, 3), expectedOutput);
	});

	it('should return whole typesOfLines if length is not specified', function() {
		expectedOutput =
			'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.';
		deepEqual(extractHeadLines(typesOfLines), expectedOutput);
	});
});

describe('extractHeadCharacters', function() {
	it('should return empty string when typesOfLines is empty', function() {
		deepEqual(extractHeadCharacters([], 2), '');
	});

	it('should return specified number of characters from typesOfLines', function() {
		expectedOutput = 'T';
		deepEqual(extractHeadCharacters(typesOfLines, 1), expectedOutput);

		expectedOutput = 'There ';
		deepEqual(extractHeadCharacters(typesOfLines, 6), expectedOutput);
	});

	it('should return whole typesOfLines if number of characters is not specified', function() {
		expectedOutput =
			'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.';
		deepEqual(extractHeadCharacters(typesOfLines), expectedOutput);
	});
});

describe('head', function() {
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return lines when option(-n) and count are not seperated by space', function() {
			deepEqual(head(['-n1', 'lines'], fs), 'There are 5 types of lines:');

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			deepEqual(head(['-n3', 'lines'], fs), expectedOutput);
		});

		it('should return lines when option(-n) and count is seperated by spaces', function() {
			deepEqual(head(['-n', '1', 'lines'], fs), 'There are 5 types of lines:');

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			deepEqual(head(['-n', '3', 'lines'], fs), expectedOutput);
		});

		it('should return lines when only count is specified', function() {
			deepEqual(head(['-1', 'lines'], fs), 'There are 5 types of lines:');

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			deepEqual(head(['-3', 'lines'], fs), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified', function() {
			deepEqual(head(['-c1', 'lines'], fs), 'T');

			expectedOutput =
				'There are 5 types of lines:\nHorizontal line.\nVertical line.';
			deepEqual(head(['-c3', 'lines'], fs), 'The');
		});

		it('should return characters when option(-c) and count is seperated by spaces', function() {
			deepEqual(head(['-c', '1', 'lines'], fs), 'T');
			deepEqual(head(['-c', '3', 'lines'], fs), 'The');
		});
	});

	describe('should return formatted fileName with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			expectedOutput =
				'==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:';
			deepEqual(head(['-n1', 'lines', 'lines'], fs), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			expectedOutput = '==> lines <==\nThe\n\n==> lines <==\nThe';
			deepEqual(head(['-c', '3', 'lines', 'lines'], fs), expectedOutput);
		});
	});

	describe('Default option and count', function() {
		it('should return 10 lines By default if option and count is not specified', function() {
			fs.existsSync = (x) => true;
			expectedOutput =
				'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
			deepEqual(head(['numbers'], fs), expectedOutput);
		});
	});

	describe('error messages', function() {
		it('should return error when invalid option is specified', function() {
			expectedOutput = 'head: illegal line count -- 0';
			deepEqual(head(['-n0', 'lines'], fs), expectedOutput);
		});

		it('should return error when -0 is given as count', function() {
			expectedOutput = 'head: illegal line count -- 0';
			deepEqual(head(['-0', 'lines'], fs), expectedOutput);
		});

		describe('should return error when count is invalid', function() {
			it('should return illegal line count when option is(-n) and invalid count', function() {
				expectedOutput = 'head: illegal line count -- -10';
				deepEqual(head(['-n-10', 'lines'], fs), expectedOutput);
			});

			it('should return illegal byte count when option is(-n) and invalid count', function() {
				expectedOutput = 'head: illegal byte count -- -10';
				deepEqual(head(['-c-10', 'lines'], fs), expectedOutput);
			});
		});

		it('should return error when invalid option is speciified', function() {
			expectedOutput =
				'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]';
			deepEqual(head(['-z', 'lines'], fs), expectedOutput);
		});

		describe('should return error when count is invalid and having characters in it', function() {
			it('should return invalid line count when option(-n) and invalid count', function() {
				expectedOutput = 'head: illegal line count -- 10u';
				deepEqual(head(['-n10u', 'lines'], fs), expectedOutput);
			});

			it('should return invalid byte count when option(-c) and invalid count', function() {
				expectedOutput = 'head: illegal byte count -- 10u';
				deepEqual(head(['-c10u', 'lines'], fs), expectedOutput);
			});
		});

		it('should return error if file not exits', function() {
			fs.existsSync = (x) => false;
			expectedOutput = 'head: abc: No such file or directory';
			deepEqual(head(['-c10', 'abc'], fs), expectedOutput);
		});

		it('should return illegal byte count when count is not a number', function() {
			expectedOutput = 'head: illegal byte count -- 10u';
			deepEqual(head(['-c10u', 'file2'], fs), expectedOutput);
		});
	});
});

describe('extractTailLines', function() {
	let string = [];
	let expectedOutput = '';

	beforeEach('Make string constant', function() {
		string = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	});

	it('should return an empty string when empty array is given ', function() {
		deepEqual(extractTailLines([]), '');
	});

	it('should return a single line when multiple element array is given and length is one', function() {
		expectedOutput = '10';
		deepEqual(extractTailLines(string, 1), expectedOutput);
	});

	it('should return a given number of lines when multiple element array is given ', function() {
		expectedOutput = '8\n9\n10';
		deepEqual(extractTailLines(string, 3), expectedOutput);
	});

	it('should return whole file when multiple element array is given and number of lines is not specified', function() {
		expectedOutput = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
		deepEqual(extractTailLines(string), expectedOutput);
	});
});

describe('extractTailCharacters', function() {
	let string = [];
	let expectedOutput = '';
	string = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	it('should return an empty string when empty array is given ', function() {
		deepEqual(extractTailCharacters([], 2), '');
	});

	it('should return a single character when length given is one', function() {
		deepEqual(extractTailCharacters(string, 1), '0');
	});

	it('should return a given number of characters when long text is given ', function() {
		deepEqual(extractTailCharacters(string, 3), '\n10');
		deepEqual(extractTailCharacters(string, 7), '\n8\n9\n10');
	});

	it('should return whole file when number of characters is not specified', function() {
		expectedOutput = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
		deepEqual(extractTailCharacters(string), expectedOutput);
	});
});

describe('tail', function() {
	const readFileSync = function(fileName) {
		let files = {
			lines:
				'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.',
			numbers: 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen'
		};
		return files[fileName];
	};

	const existsSync = function(fileName) {
		let files = ['lines', 'numbers', 'typesOfLines', 'lineData', 'digits'];
		return files.includes(fileName);
	};

	const fs = { existsSync, readFileSync };
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return lines when option(-n) and count are not seperated by space', function() {
			deepEqual(tail(['-n1', 'lines'], fs), 'Perpendicular Lines.');

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(tail(['-n3', 'numbers'], fs), expectedOutput);
		});

		it('should return lines when option(-n) and count is seperated by spaces', function() {
			deepEqual(tail(['-n', '1', 'numbers'], fs), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(tail(['-n', '3', 'numbers'], fs), expectedOutput);
		});

		it('should return lines when only count is specified', function() {
			deepEqual(tail(['-1', 'numbers'], fs), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(tail(['-3', 'numbers'], fs), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified', function() {
			deepEqual(tail(['-c1', 'numbers'], fs), 'n');

			deepEqual(tail(['-c3', 'numbers'], fs), 'Ten');
		});

		it('should return characters when option(-c) and count is seperated by spaces', function() {
			deepEqual(tail(['-c', '1', 'numbers'], fs), 'n');
			deepEqual(tail(['-c', '3', 'numbers'], fs), 'Ten');
		});
	});

	describe('should return formatted fileName with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			deepEqual(tail(['-n1', 'lines', 'numbers'], fs), expectedOutput);
		});

		it('should return when option(-c) and count is specified', function() {
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			deepEqual(tail(['-c', '3', 'lines', 'numbers'], fs), expectedOutput);
		});
	});

	describe('Default option and count', function() {
		it('should return 10 lines By default if option and count is not specified', function() {
			fs.existsSync = (x) => true;
			expectedOutput =
				'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
			deepEqual(tail(['numbers'], fs), expectedOutput);
		});

		it('should return error when invalid option is specified', function() {
			expectedOutput =
				'tail: illegal option -- z\nusage: tail [-n lines | -c bytes] [file ...]';
			deepEqual(tail(['-z', 'lines'], fs), expectedOutput);
		});

		describe('should return error when count is invalid and having characters in it', function() {
			it('should return illegal when option(-n) and invalid count', function() {
				expectedOutput = 'tail: illegal offset -- 10u';
				deepEqual(tail(['-n10u', 'lines'], fs), expectedOutput);
			});
		});

		it('should return error if file not exits', function() {
			fs.existsSync = (x) => false;
			expectedOutput = 'tail: abc: No such file or directory';
			deepEqual(tail(['-c10', 'abc'], fs), expectedOutput);
		});

		it('should return illegal byte count when count is not a number', function() {
			expectedOutput = 'tail: illegal offset -- 10u';
			deepEqual(tail(['-c10u', 'file2'], fs), expectedOutput);
		});

		it('should return nothing when input is zero', function() {
			deepEqual(tail(['-n0', 'lines'], fs), '');
		});

		it('should return nothing when input is -0', function() {
			deepEqual(tail(['-0', 'lines'], fs), '');
		});
	});
});

describe('fetchMultipleFileData', function() {
	let truthy = (x) => true;
	details = {
		readFileSync,
		existsSync,
		binaryFunc: truthy,
		count: 2,
		operation: 'head'
	};
	let multipleFileData = fetchMultipleFileData.bind(null, details);

	it('should keep function references as it is', function() {
		inputData = { delimeter: '', contents: [] };
		expectedOutput = { delimeter: '\n', contents: ['==> lineData <==', true] };
		deepEqual(multipleFileData(inputData, 'lineData'), expectedOutput);
	});

	it('should return fetched typesOfLines in contents key and change delimeter to \\n', function() {
		inputData = { delimeter: '', contents: [] };
		expectedOutput = { delimeter: '\n', contents: ['==> lineData <==', true] };
		deepEqual(multipleFileData(inputData, 'lineData'), expectedOutput);
	});

	it('should return error when file is not exist', function() {
		inputData = { delimeter: '', contents: [] };
		expectedOutput = {
			delimeter: '\n',
			contents: ['head: abc: No such file or directory']
		};
		deepEqual(multipleFileData(inputData, 'abc'), expectedOutput);
	});
});

describe('getContent', function() {
	const readFileSync = function(fileName) {
		let files = {
			lines:
				'There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.',
			numbers: 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen'
		};
		return files[fileName];
	};

	const existsSync = function(fileName) {
		let files = ['lines', 'numbers', 'typesOfLines', 'lineData', 'digits'];
		return files.includes(fileName);
	};

	const fs = { existsSync, readFileSync };
	describe('should return specified number of lines or bytes from file depends upon option', function() {
		it('should return lines when option(-n) and count are not seperated by space', function() {
			deepEqual(
				getContent(['-n1', 'lines'], fs, 'tail'),
				'Perpendicular Lines.'
			);

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(getContent(['-n3', 'numbers'], fs, 'tail'), expectedOutput);
		});

		it('should return lines when option(-n) and count is seperated by spaces', function() {
			deepEqual(getContent(['-n', '1', 'numbers'], fs, 'tail'), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(getContent(['-n', '3', 'numbers'], fs, 'tail'), expectedOutput);
		});

		it('should return lines when only count is specified', function() {
			deepEqual(getContent(['-1', 'numbers'], fs, 'tail'), 'Ten');

			expectedOutput = 'Eight\nNine\nTen';
			deepEqual(getContent(['-3', 'numbers'], fs, 'tail'), expectedOutput);
		});

		it('should return characters when option(-c) and count is specified', function() {
			deepEqual(getContent(['-c1', 'numbers'], fs, 'tail'), 'n');

			deepEqual(getContent(['-c3', 'numbers'], fs, 'tail'), 'Ten');
		});

		it('should return characters when option(-c) and count is seperated by spaces', function() {
			deepEqual(getContent(['-c', '1', 'numbers'], fs, 'tail'), 'n');
			deepEqual(getContent(['-c', '3', 'numbers'], fs, 'tail'), 'Ten');
		});
	});

	describe('should return formatted fileName with their contents for multiple files', function() {
		it('should return when option(-n) and count is specified', function() {
			expectedOutput =
				'==> lines <==\nPerpendicular Lines.\n\n==> numbers <==\nTen';
			deepEqual(
				getContent(['-n1', 'lines', 'numbers'], fs, 'tail'),
				expectedOutput
			);
		});

		it('should return when option(-c) and count is specified', function() {
			expectedOutput = '==> lines <==\nes.\n\n==> numbers <==\nTen';
			deepEqual(
				getContent(['-c', '3', 'lines', 'numbers'], fs, 'tail'),
				expectedOutput
			);
		});
	});
});

describe('singleValidFile', function() {
	it('should return true if it has a single file', function() {
		deepEqual(isValidSingleFile(['numbers'], existsSync), true);
	});

	it('should return false if it has more than one file', function() {
		deepEqual(isValidSingleFile(['abc', 'numbers'], existsSync), false);
	});
});
