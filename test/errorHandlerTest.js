const { deepEqual } = require("assert");
const {checkHead, checkTail, isZero, hasOtherCharacters, invalidCount} = require("../src/errorHandler.js");

describe('checkHead', function() {
    it('should return undefined if function condition is false', function() {
      deepEqual(checkHead(["n", "10","numbers"], 10, "n"), undefined);
    });
  
    it('should return error if count is invalid', function() {
      expectedOutput = "head: illegal line count -- 0";
      deepEqual(checkHead(["n","-0","head"], 0, "n"), expectedOutput);
    });
  
    it('should return error filename is invalid', function() {
        expectedOutput = "head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]";
        deepEqual(checkHead(["-z","10","abc"], 10, "z"), expectedOutput);
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
  describe("hasOtherCharacters", function() {
    it("should return true if has chracters except options", function() {
      deepEqual(hasOtherCharacters(["-z"]), true);
    });
  
    it("should return false if has option", function() {
      deepEqual(hasOtherCharacters(["-n"]), false);
    });
  });  

  describe('checkTail', function() {
    it('should return undefined if function condition is false', function() {
      deepEqual(checkTail(["n", "10","numbers"], 10, "n"), undefined);
    });
  
    it('should return error if count is invalid', function() {
      deepEqual(checkTail(["n","-0","tail"], 0, "n"), "");
    });
  
    it('should return error filename is invalid', function() {
        expectedOutput = "tail: illegal option -- z\nusage: tail [-n lines | -c bytes] [file ...]";
        deepEqual(checkTail(["-z","10","abc"], 10, "z"), expectedOutput);
    });
  });