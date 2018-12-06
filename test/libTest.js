const { deepEqual } = require("assert");
const { extractLines,
  extractCharacters,
  organizeInput,
  fetchData,
  getContent,
  head} = require("../src/lib.js");

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

describe('organizeInput', function () {
  let inputData;
  let expectedOutput;

  it('should separate all arguments and give default option -n and count 10', function () {
    inputData = ['','','file1.txt','file2.txt']
    expectedOutput = {option : 'n' , count : 10 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);
  });

  it('should separate all arguments and give default option -n and count as given', function () {
    inputData = ['','',-5,'file1.txt','file2.txt']
    expectedOutput = {option : 'n' , count : 5 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);
  });

  it('should seperate option and count', function () {
    inputData = ['','',"-n10",'file1.txt','file2.txt']
    expectedOutput = {option : 'n' , count : 10 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);

    inputData = ['','',"-c10",'file1.txt','file2.txt']
    expectedOutput = {option : 'c' , count : 10 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);
  });

  it('should give seperated option and count', function () {
    inputData = [,,"-n",10, 'file1.txt','file2.txt']
    expectedOutput = {option : 'n' , count : 10 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);

    inputData = ['','',"-c",10,'file1.txt','file2.txt']
    expectedOutput = {option : 'c' , count : 10 , files:['file1.txt','file2.txt']}
    deepEqual(organizeInput(inputData),expectedOutput);
  });
});

describe('fetchData', function() { 
  let inputData;
  let expectedOutput;
  const readContent = filename => "dummy content"; 
  const truthy = value => true;
  const validater = file => true;

  it('should keep function references as it is', function() {
    inputData = {delimeter : '', readContent, validater, funcRef : truthy, output : [], count : 2};
    expectedOutput = {delimeter : "\n", readContent, validater, funcRef : truthy, output : ['==> data <==', true], count : 2};
    deepEqual(fetchData(inputData,"data"),expectedOutput); 
  });

  it('should return fetched data in output key and change delimeter to \\n', function() {
    inputData = {delimeter : '', readContent, validater, funcRef : truthy, output : [], count : 2};
    expectedOutput = {delimeter : '\n', readContent, validater, funcRef : truthy, output : ['==> data <==', true], count : 2};
    deepEqual(fetchData(inputData, "data"), expectedOutput); 
  });
});

describe('head', function() {
  const validater = file => true;
  const file1 = "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines."
  const readContent = filename => file1; 
  let expectedOutput;

  it('should return specified number of lines or bytes from file depends upon option', function() { 
    deepEqual(head([,,"-n1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(head([,,"-n","1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(head([,,"-1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(head([,,"-c1","file1"],validater, readContent),"T");
    deepEqual(head([,,"-c","1","file1"],validater, readContent),"T");

    expectedOutput = "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(head([,,"-n3","file1"],validater, readContent),expectedOutput);
    deepEqual(head([,,"-n","3","file1"],validater, readContent),expectedOutput);
    deepEqual(head([,,"-3","file1"],validater, readContent),expectedOutput);
    deepEqual(head([,,"-c3","file1"],validater, readContent),"The");
    deepEqual(head([,,"-c","3","file1"],validater, readContent),"The");
  });

  it('should return formatted fileName with their contents for multiple files', function() {
    expectedOutput = "==> file1 <==\nThere are 5 types of lines:\n\n==> file1 <==\nThere are 5 types of lines:"
    deepEqual(head([,,"-n1","file1","file1"],validater, readContent),expectedOutput); 
    deepEqual(head([,,"-n","1","file1","file1"],validater, readContent),expectedOutput); 
    deepEqual(head([,,"-1","file1","file1"],validater, readContent),expectedOutput); 
  });

  it('should return 10 lines By default if option and count is not specified', function() {
    let numbers = "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen"; 
    expectedOutput = "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen"; 
    let readFile = filename => numbers;
    deepEqual(head([,,"numbers"],validater, readFile),expectedOutput);
  });

  it('should return error when invalid option is specified', function() {
    expectedOutput = 'head: illegal line count -- 0';
    deepEqual(head([,,"-n0","file1"],validater, readContent),expectedOutput);
  });

  it('should return error when -0 is given as count', function() {
    expectedOutput = 'head: illegal line count -- 0';
    deepEqual(head([,,"-0","file1"],validater, readContent),expectedOutput);
  });

  it('should return error when count is invalid', function() {
    expectedOutput = 'head: illegal line count -- -10';
    deepEqual(head([,,"-n-10","file1"],validater, readContent),expectedOutput);

    expectedOutput = 'head: illegal byte count -- -10';
    deepEqual(head([,,"-c-10","file1"],validater, readContent),expectedOutput);
  });

  it('should return error when invalid option is speciified', function() {
    expectedOutput = 'head: illegal option -- z\nusage: head [-n lines | -c bytes] [file ...]' 
    deepEqual(head([,,"-z","file1"],validater, readContent),expectedOutput);
  });

  it('should return error when count is invalid and having characters in it', function() {
    expectedOutput = "head: illegal line count -- 10u";
    deepEqual(head([,,"-n10u","file1"],validater, readContent),expectedOutput);

    expectedOutput = "head: illegal byte count -- 10u";
    deepEqual(head([,,"-c10u","file1"],validater, readContent),expectedOutput);
  });
});

describe('getContent', function() {
  const validater = file => true;
  const file1 = "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines."
  const readContent = filename => file1; 
  let expectedOutput;

  it('should return specified number of lines or bytes from file depends upon option', function() { 
    deepEqual(getContent([,,"-n1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(getContent([,,"-n","1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(getContent([,,"-1","file1"],validater, readContent),"There are 5 types of lines:");
    deepEqual(getContent([,,"-c1","file1"],validater, readContent),"T");
    deepEqual(getContent([,,"-c","1","file1"],validater, readContent),"T");

    expectedOutput = "There are 5 types of lines:\nHorizontal line.\nVertical line.";
    deepEqual(getContent([,,"-n3","file1"],validater, readContent),expectedOutput);
    deepEqual(getContent([,,"-n","3","file1"],validater, readContent),expectedOutput);
    deepEqual(getContent([,,"-3","file1"],validater, readContent),expectedOutput);
    deepEqual(getContent([,,"-c3","file1"],validater, readContent),"The");
    deepEqual(getContent([,,"-c","3","file1"],validater, readContent),"The");
  });

  it('should return formatted fileName with their contents for multiple files', function() {
    expectedOutput = "==> file1 <==\nThere are 5 types of lines:\n\n==> file1 <==\nThere are 5 types of lines:"
    deepEqual(getContent([,,"-n1","file1","file1"],validater, readContent),expectedOutput); 
    deepEqual(getContent([,,"-n","1","file1","file1"],validater, readContent),expectedOutput); 
    deepEqual(getContent([,,"-1","file1","file1"],validater, readContent),expectedOutput); 
  });

  it('should return 10 lines By default if option and count is not specified', function() {
    let numbers = "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen"; 
    expectedOutput = "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen"; 
    let readFile = filename => numbers;
    deepEqual(getContent([,,"numbers"],validater, readFile),expectedOutput);
  });
});
