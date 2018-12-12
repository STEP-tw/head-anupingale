const { deepEqual } = require("assert");
const {parseInput, hasOption, hasDash} = require("../src/parser.js");

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
  
describe("hasDash", function() {
    it("should return true if the input includes dash", function() {
      deepEqual(hasDash("-"), true);
    });
  
    it("should return false if the input has no dashes", function() {
      deepEqual(hasDash(""), false);
    });
  });
  