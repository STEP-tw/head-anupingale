const { deepEqual } = require("assert");
const {
  extractLines,
  extractCharacters,
  parseInput,
  retrieveData,
  getContent,
  head,
  isZero,
  hasDash,
  hasOption,
  invalidCount
} = require("../src/lib.js");

const typesOfLines = [
  "There are 5 types of lines:",
  "Horizontal line.",
  "Vertical line.",
  "Skew Lines.",
  "Parallel Lines.",
  "Perpendicular Lines."
];

const readFileSync = function(fileName) {
  let files = {
    lines:
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.",
    numbers: "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen",
    lineData:
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines."
  };
  return files[fileName];
};

const existsSync = function(fileName) {
  let files = ["lines", "numbers", "typesOfLines", "lineData"];
  return files.includes(fileName);
};

const fs = { existsSync, readFileSync };

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
  describe("should seperate all arguments", function() {
    it("should give default option -n and count 10 when both are not specified", function() {
      inputData = ["typesOfLines", "numbers"];
      expectedOutput = {
        option: "n",
        count: 10,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);
    });

    it("should give default option -n if option is not specified", function() {
      inputData = [-5, "typesOfLines", "numbers"];
      expectedOutput = {
        option: "n",
        count: 5,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);
    });

    it("should seperate option and count when taken as single argument", function() {
      inputData = ["-n10", "typesOfLines", "numbers"];
      expectedOutput = {
        option: "n",
        count: 10,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);

      inputData = ["-c10", "typesOfLines", "numbers"];
      expectedOutput = {
        option: "c",
        count: 10,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);
    });

    it("should return option and count when seperated with spaces", function() {
      inputData = ["-n", 10, "typesOfLines", "numbers"];
      expectedOutput = {
        option: "n",
        count: 10,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);

      inputData = ["-c", 10, "typesOfLines", "numbers"];
      expectedOutput = {
        option: "c",
        count: 10,
        files: ["typesOfLines", "numbers"]
      };
      deepEqual(parseInput(inputData), expectedOutput);
    });
  });
});

describe("retrieveData", function() {
  let truthy = x => true;
  let falsy = x => false;

  it("should keep function references as it is", function() {
    inputData = {
      delimeter: "",
      readFileSync,
      existsSync,
      funcRef: truthy,
      contents: [],
      count: 2
    };
    expectedOutput = {
      delimeter: "\n",
      readFileSync,
      existsSync,
      funcRef: truthy,
      contents: ["==> lineData <==", true],
      count: 2
    };
    deepEqual(retrieveData(inputData, "lineData"), expectedOutput);
  });

  it("should return fetched typesOfLines in contents key and change delimeter to \\n", function() {
    inputData = {
      delimeter: "",
      readFileSync,
      existsSync,
      funcRef: truthy,
      contents: [],
      count: 2
    };
    expectedOutput = {
      delimeter: "\n",
      readFileSync,
      existsSync,
      funcRef: truthy,
      contents: ["==> lineData <==", true],
      count: 2
    };
    deepEqual(retrieveData(inputData, "lineData"), expectedOutput);
  });

  it("should return error if file not exit", function() {
    inputData = {
      delimeter: "",
      readFileSync,
      existsSync,
      funcRef: truthy,
      contents: [],
      count: 2
    };
  });
});

describe("head", function() {
  describe("should return specified number of lines or bytes from file depends upon option", function() {
    it("should return lines when option(-n) and count are not seperated by space", function() {
      deepEqual(head(["-n1", "lines"], fs), "There are 5 types of lines:");

      expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.";
      deepEqual(head(["-n3", "lines"], fs), expectedOutput);
    });

    it("should return lines when option(-n) and count is seperated by spaces", function() {
      deepEqual(head(["-n", "1", "lines"], fs), "There are 5 types of lines:");

      expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.";
      deepEqual(head(["-n", "3", "lines"], fs), expectedOutput);
    });

    it("should return lines when only count is specified", function() {
      deepEqual(head(["-1", "lines"], fs), "There are 5 types of lines:");

      expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.";
      deepEqual(head(["-3", "lines"], fs), expectedOutput);
    });

    it("should return characters when option(-c) and count is specified", function() {
      deepEqual(head(["-c1", "lines"], fs), "T");

      expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.";
      deepEqual(head(["-c3", "lines"], fs), "The");
    });

    it("should return characters when option(-c) and count is seperated by spaces", function() {
      deepEqual(head(["-c", "1", "lines"], fs), "T");
      deepEqual(head(["-c", "3", "lines"], fs), "The");
    });
  });

  describe("should return formatted fileName with their contents for multiple files", function() {
    it("should return when option(-n) and count is specified", function() {
      expectedOutput =
        "==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:";
      deepEqual(head(["-n1", "lines", "lines"], fs), expectedOutput);
    });

    it("should return when option(-c) and count is specified", function() {
      expectedOutput = "==> lines <==\nThe\n\n==> lines <==\nThe";
      deepEqual(head(["-c", "3", "lines", "lines"], fs), expectedOutput);
    });
  });

  describe("Default option and count", function() {
    it("should return 10 lines By default if option and count is not specified", function() {
      fs.existsSync = x => true;
      expectedOutput =
        "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
      deepEqual(head(["numbers"], fs), expectedOutput);
    });
  });

  describe("error messages", function() {
    it("should return error when invalid option is specified", function() {
      expectedOutput = "head: illegal line count -- 0";
      deepEqual(head(["-n0", "lines"], fs), expectedOutput);
    });

    it("should return error when -0 is given as count", function() {
      expectedOutput = "head: illegal line count -- 0";
      deepEqual(head(["-0", "lines"], fs), expectedOutput);
    });

    describe("should return error when count is invalid", function() {
      it("should return illegal line count when option is(-n) and invalid count", function() {
        expectedOutput = "head: illegal line count -- -10";
        deepEqual(head(["-n-10", "lines"], fs), expectedOutput);
      });

      it("should return illegal byte count when option is(-n) and invalid count", function() {
        expectedOutput = "head: illegal byte count -- -10";
        deepEqual(head(["-c-10", "lines"], fs), expectedOutput);
      });
    });

    it("should return error when invalid option is speciified", function() {
      expectedOutput =
        "head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]";
      deepEqual(head(["-z", "lines"], fs), expectedOutput);
    });

    describe("should return error when count is invalid and having characters in it", function() {
      it("should return invalid line count when option(-n) and invalid count", function() {
        expectedOutput = "head: illegal line count -- 10u";
        deepEqual(head(["-n10u", "lines"], fs), expectedOutput);
      });

      it("should return invalid byte count when option(-c) and invalid count", function() {
        expectedOutput = "head: illegal byte count -- 10u";
        deepEqual(head(["-c10u", "lines"], fs), expectedOutput);
      });
    });

    it("should return error if file not exits", function() {
      fs.existsSync = x => false;
      expectedOutput = "head: abc: No such file or directory";
      deepEqual(head(["-c10", "abc"], fs), expectedOutput);
    });

    it("should return illegal byte count when count is not a number", function() {
      expectedOutput = "head: illegal byte count -- 10u";
      deepEqual(head(["-c10u", "file2"], fs), expectedOutput);
    });
  });
});

describe("getContent", function() {
  it("should return specified number of lines or bytes from file depends upon option", function() {
    deepEqual(
      getContent(["-n1", "lines"], existsSync, readFileSync),
      "There are 5 types of lines:"
    );
    deepEqual(
      getContent(["-n", "1", "lines"], existsSync, readFileSync),
      "There are 5 types of lines:"
    );
    deepEqual(
      getContent(["-1", "lines"], existsSync, readFileSync),
      "There are 5 types of lines:"
    );
    deepEqual(getContent(["-c1", "lines"], existsSync, readFileSync), "T");
    deepEqual(getContent(["-c", "1", "lines"], existsSync, readFileSync), "T");

    expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(
      getContent(["-n3", "lines"], existsSync, readFileSync),
      expectedOutput
    );
    deepEqual(
      getContent(["-n", "3", "lines"], existsSync, readFileSync),
      expectedOutput
    );
    deepEqual(
      getContent(["-3", "lines"], existsSync, readFileSync),
      expectedOutput
    );
    deepEqual(getContent(["-c3", "lines"], existsSync, readFileSync), "The");
    deepEqual(
      getContent(["-c", "3", "lines"], existsSync, readFileSync),
      "The"
    );
  });

  it("should return 10 lines By default if option and count is not specified", function() {
    expectedOutput =
      "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
    deepEqual(
      getContent(["numbers"], existsSync, readFileSync),
      expectedOutput
    );
  });

  it("should return formatted fileName with their contents for multiple files", function() {
    expectedOutput =
      "==> lines <==\nThere are 5 types of lines:\n\n==> lines <==\nThere are 5 types of lines:";
    deepEqual(
      getContent(["-n1", "lines", "lines"], existsSync, readFileSync),
      expectedOutput
    );
    deepEqual(
      getContent(["-n", "1", "lines", "lines"], existsSync, readFileSync),
      expectedOutput
    );
    deepEqual(
      getContent(["-1", "lines", "lines"], existsSync, readFileSync),
      expectedOutput
    );
  });

  it("should return error if file not exit", function() {
    expectedOutput = "head: abc: No such file or directory";
    deepEqual(
      getContent(["-c10", "abc"], existsSync, readFileSync),
      expectedOutput
    );
  });
});

describe("isZero", function() {
  it("should return true if the value is zero", function() {
    deepEqual(isZero(0), true);
  });

  it("should return false if the value is nonZero", function() {
    deepEqual(isZero(2), false);
  });
});

describe("hasDash", function() {
  it("should return true if the input includes dash", function() {
    deepEqual(hasDash("-"), true);
  });

  it("should return false if the input has no dashes", function() {
    deepEqual(hasDash(""), false);
  });
});

describe("hasOption", function() {
  it("should return true if option(-n) is valid", function() {
    deepEqual(hasOption("-n"), true);
  });

  it("should return true if option(-c) is valid", function() {
    deepEqual(hasOption("-c"), true);
  });

  it("should return false it option is invalid", function() {
    deepEqual(hasOption("-d"), false);
  });
});

describe("invalidCount", function() {
  it("should return invalid line count if option is n", function() {
    expectedOutput = "head: illegal line count -- 5";
    deepEqual(invalidCount("n", 5), expectedOutput);
  });

  it("should return invalid byte count if option is c", function() {
    expectedOutput = "head: illegal byte count -- 5";
    deepEqual(invalidCount("c", 5), expectedOutput);
  });
});
