const { deepEqual } = require("assert");
const {
  extractLines,
  extractCharacters,
  parseInput,
  retrieveData,
  getContent,
  head
} = require("../src/lib.js");

const typesOfLines = [
  "There are 5 types of lines:",
  "Horizontal line.",
  "Vertical line.",
  "Skew Lines.",
  "Parallel Lines.",
  "Perpendicular Lines."
];
const lines =
  "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.";
const contentReader = filename => filename;
let numbers = "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
const falsy = x => false;
const truthy = value => true;
let readFile = filename => numbers;
let doesExist = file => true;
let expectedOutput;
let inputData;

describe("extractLines", function() {
  it("should return empty string when typesOfLines is empty", function() {
    deepEqual(extractLines([], 2), "");
  });

  it("should return single line from typesOfLines when number of line is 1", function() {
    expectedOutput = "There are 5 types of lines:";
    deepEqual(extractLines(typesOfLines, 1), expectedOutput);
  });

  it("should return specified number of lines joined with \\n ", function() {
    expectedOutput = "There are 5 types of lines:\nHorizontal line.";
    deepEqual(extractLines(typesOfLines, 2), expectedOutput);

    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(extractLines(typesOfLines, 3), expectedOutput);
  });

  it("should return whole typesOfLines if length is not specified", function() {
    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.";
    deepEqual(extractLines(typesOfLines), expectedOutput);
  });
});

describe("extractCharacters", function() {
  it("should return empty string when typesOfLines is empty", function() {
    deepEqual(extractCharacters([], 2), "");
  });

  it("should return specified number of characters from typesOfLines", function() {
    expectedOutput = "T";
    deepEqual(extractCharacters(typesOfLines, 1), expectedOutput);

    expectedOutput = "There ";
    deepEqual(extractCharacters(typesOfLines, 6), expectedOutput);
  });

  it("should return whole typesOfLines if number of characters is not specified", function() {
    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.";
    deepEqual(extractCharacters(typesOfLines), expectedOutput);
  });
});

describe("parseInput", function() {
  it("should separate all arguments and give default option -n and count 10", function() {
    inputData = [ "typesOfLines", "numbers"];
    expectedOutput = {
      option: "n",
      count: 10,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);
  });

  it("should separate all arguments and give default option -n and count as given", function() {
    inputData = [ -5, "typesOfLines", "numbers"];
    expectedOutput = {
      option: "n",
      count: 5,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);
  });

  it("should seperate option and count", function() {
    inputData = [ "-n10", "typesOfLines", "numbers"];
    expectedOutput = {
      option: "n",
      count: 10,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);

    inputData = [ "-c10", "typesOfLines", "numbers"];
    expectedOutput = {
      option: "c",
      count: 10,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);
  });

  it("should give seperated option and count", function() {
    inputData = ["-n", 10, "typesOfLines", "numbers"];
    expectedOutput = {
      option: "n",
      count: 10,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);

    inputData = [ "-c", 10, "typesOfLines", "numbers"];
    expectedOutput = {
      option: "c",
      count: 10,
      files: ["typesOfLines", "numbers"]
    };
    deepEqual(parseInput(inputData), expectedOutput);
  });
});

describe("retrieveData", function() {
  it("should keep function references as it is", function() {
    inputData = {
      delimeter: "",
      contentReader,
      doesExist,
      funcRef: truthy,
      contents: [],
      count: 2
    };
    expectedOutput = {
      delimeter: "\n",
      contentReader,
      doesExist,
      funcRef: truthy,
      contents: ["==> typesOfLines <==", true],
      count: 2
    };
    deepEqual(retrieveData(inputData, "typesOfLines"), expectedOutput);
  });

  it("should return fetched typesOfLines in contents key and change delimeter to \\n", function() {
    inputData = {
      delimeter: "",
      contentReader,
      doesExist,
      funcRef: truthy,
      contents: [],
      count: 2
    };
    expectedOutput = {
      delimeter: "\n",
      contentReader,
      doesExist,
      funcRef: truthy,
      contents: ["==> typesOfLines <==", true],
      count: 2
    };
    deepEqual(retrieveData(inputData, "typesOfLines"), expectedOutput);
  });

  it("should return error if file not exit", function() {
    doesExist = x => false;
    inputData = {
      delimeter: "",
      contentReader,
      doesExist,
      funcRef: truthy,
      contents: [],
      count: 2
    };
    expectedOutput =
      "head: abc: No such file or directory\nhead: abc: No such file or directory";
    deepEqual(
      head(["-c10", "abc", "abc"], doesExist, getContent),
      expectedOutput
    );
  });
});

describe("head", function() {
  const doesExist = file => true;
  const contentReader = filename => lines;

  it("should return specified number of lines or bytes from file depends upon option", function() {
    deepEqual(
      head(["-n1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(
      head(["-n", "1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(
      head(["-1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(head(["-c1", "lines"], doesExist, contentReader), "T");
    deepEqual(head(["-c", "1", "lines"], doesExist, contentReader), "T");

    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(
      head(["-n3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      head(["-n", "3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      head(["-3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(head(["-c3", "lines"], doesExist, contentReader), "The");
    deepEqual(head(["-c", "3", "lines"], doesExist, contentReader), "The");
  });

  it("should return formatted fileName with their contents for multiple files", function() {
    expectedOutput =
      "==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:";
    deepEqual(
      head(["-n1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      head(["-n", "1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      head(["-1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return 10 lines By default if option and count is not specified", function() {
    expectedOutput =
      "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
    deepEqual(head(["numbers"], doesExist, readFile), expectedOutput);
  });

  it("should return error when invalid option is specified", function() {
    expectedOutput = "head: illegal line count -- 0";
    deepEqual(
      head(["-n0", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return error when -0 is given as count", function() {
    expectedOutput = "head: illegal line count -- 0";
    deepEqual(
      head(["-0", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return error when count is invalid", function() {
    expectedOutput = "head: illegal line count -- -10";
    deepEqual(
      head(["-n-10", "lines"], doesExist, contentReader),
      expectedOutput
    );

    expectedOutput = "head: illegal byte count -- -10";
    deepEqual(
      head(["-c-10", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return error when invalid option is speciified", function() {
    expectedOutput =
      "head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]";
    deepEqual(
      head(["-z", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return error when count is invalid and having characters in it", function() {
    expectedOutput = "head: illegal line count -- 10u";
    deepEqual(
      head(["-n10u", "lines"], doesExist, contentReader),
      expectedOutput
    );

    expectedOutput = "head: illegal byte count -- 10u";
    deepEqual(
      head(["-c10u", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return error if file not exit", function() {
    expectedOutput = "head: abc: No such file or directory";
    deepEqual(head(["-c10", "abc"], falsy, contentReader), expectedOutput);
  });

  it("should return error if file name is invalid", function() {
    expectedOutput = "head: illegal byte count -- 10u";
    deepEqual(
      head(["-c10u", "file2"], falsy, contentReader),
      expectedOutput
    );
  });
});

describe("getContent", function() {
  const doesExist = file => true;
  const contentReader = filename => lines;

  it("should return specified number of lines or bytes from file depends upon option", function() {
    deepEqual(
      getContent(["-n1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(
      getContent(["-n", "1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(
      getContent(["-1", "lines"], doesExist, contentReader),
      "There are 5 types of lines:"
    );
    deepEqual(getContent(["-c1", "lines"], doesExist, contentReader), "T");
    deepEqual(
      getContent(["-c", "1", "lines"], doesExist, contentReader),
      "T"
    );

    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(
      getContent(["-n3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      getContent(["-n", "3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      getContent(["-3", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      getContent(["-c3", "lines"], doesExist, contentReader),
      "The"
    );
    deepEqual(
      getContent(["-c", "3", "lines"], doesExist, contentReader),
      "The"
    );
  });

  it("should return formatted fileName with their contents for multiple files", function() {
    expectedOutput =
      "==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:";
    deepEqual(
      getContent(["-n1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      getContent(["-n", "1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
    deepEqual(
      getContent(["-1", "lines", "lines"], doesExist, contentReader),
      expectedOutput
    );
  });

  it("should return 10 lines By default if option and count is not specified", function() {
    expectedOutput =
      "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
    deepEqual(getContent(["numbers"], doesExist, readFile), expectedOutput);
  });
});
