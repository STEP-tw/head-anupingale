const { deepEqual } = require("assert");
const { extractLines,
  extractCharacters} = require("../src/lib.js");

describe('extractLines', function() {
  const file = ["There are 5 types of lines:","Horizontal line.","Vertical line.","Skew Lines.","Parallel Lines.","Perpendicular Lines."]
  let output;

  it('should return empty string when file is empty', function() {
    deepEqual(extractLines([],2),'');
  });

  it('should return single line from file when number of line is 1', function() {
    output = "There are 5 types of lines:"; 
    deepEqual(extractLines(file,1),output); 
  });

  it('should return specified number of lines joined with \\n ', function() {
    output = "There are 5 types of lines:\nHorizontal line."; 
    deepEqual(extractLines(file,2),output);

    output = "There are 5 types of lines:\nHorizontal line.\nVertical line."; 
    deepEqual(extractLines(file,3),output);
  });

  it('should return whole file if length is not specified', function() {
  output = "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines."
    deepEqual(extractLines(file),output); 
  });
});

describe('extractCharacters', function() {
  const file = ["There are 5 types of lines:","Horizontal line.","Vertical line.","Skew Lines.","Parallel Lines.","Perpendicular Lines."]
  let output;

  it('should return empty string when file is empty', function() {
    deepEqual(extractCharacters([],2),'');
  });

  it('should return specified number of characters from file', function() {
    output = "T";
    deepEqual(extractCharacters(file,1),output);

    output = "There ";
    deepEqual(extractCharacters(file,6),output);
  });

  it('should return whole file if number of characters is not specified', function() {
  output = "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines."
    deepEqual(extractCharacters(file),output);
  });
});

