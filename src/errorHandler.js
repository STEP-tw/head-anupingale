const {hasDash} = require("./parser.js");

const isZero = function(value) {
    return value == 0;
};

const invalidCount = function(option, count) {
    return option == "n"
      ? "head: illegal line count -- " + count
      : "head: illegal byte count -- " + count;
  };

const hasInvalidOption = function(fileDetails) {
    let invalidOption = hasDash(fileDetails[0][0]) &&
    !["n","c"].includes(fileDetails[0][1]);
    return invalidOption && !parseInt(fileDetails[0]);
  };

const validateHeadArguments = function(fileDetails, count, option) {
    if (isZero(fileDetails[0])) {
      return "head: illegal line count -- 0";
    }
    if (isNaN(count - 0) || count < 1) {
      return invalidCount(option, count);
    }
    if (hasInvalidOption(fileDetails)) {
      return (
        "head: illegal option -- " + fileDetails[0][1] + "\n" + "usage: head [-n lines | -c bytes] [file ...]"
      );
    }
  }

  const validateTailArguments = function(fileDetails, count, files) {
    if (files.includes("-0") || count == 0) {
      return "";
    }
  
    if (isNaN(count)) {
      return "tail: illegal offset -- " + fileDetails[0].slice(2);
    }
  
    if (hasInvalidOption(fileDetails)) {
      let error = "tail: illegal option -- " + fileDetails[0][1] + "\n";
      error += "usage: tail [-n lines | -c bytes] [file ...]";
      return error;
    }
  }

  module.exports = {
    validateHeadArguments, 
    validateTailArguments, 
    isZero, 
    hasInvalidOption, 
    invalidCount
  };