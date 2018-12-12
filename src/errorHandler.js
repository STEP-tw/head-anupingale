const {hasDash} = require("./parser.js");

const isZero = function(value) {
    return value == 0;
};

const invalidCount = function(option, count, functionName) {
    return option == "n"
      ? "head: illegal line count -- " + count
      : "head: illegal byte count -- " + count;
  };

const hasOtherCharacters = function(fileDetails) {
    return (
      hasDash(fileDetails[0][0]) &&
      fileDetails[0][1] != "c" &&
      fileDetails[0][1] != "n" &&
      !parseInt(fileDetails[0])
    );
  };

const checkHead = function(fileDetails, count, option) {
    if (isZero(fileDetails[0]) || count == 0) {
      return "head: illegal line count -- " + "0";
    }
    if (isNaN(count - 0) || count < 1) {
      return invalidCount(option, count);
    }
    if (hasOtherCharacters(fileDetails)) {
      return (
        "head: illegal option -- " + fileDetails[0][1] + "\n" + "usage: head [-n lines | -c bytes] [file ...]"
      );
    }
  }

  const checkTail = function(fileDetails, count, files) {
    if (files.includes("-0") || count == 0) {
      return "";
    }
  
    if (isNaN(count)) {
      return "tail: illegal offset -- " + fileDetails[0].slice(2);
    }
  
    if (hasOtherCharacters(fileDetails)) {
      let error = "tail: illegal option -- " + fileDetails[0][1] + "\n";
      error += "usage: tail [-n lines | -c bytes] [file ...]";
      return error;
    }
  }

  module.exports = {checkHead, checkTail, isZero, hasOtherCharacters, invalidCount};