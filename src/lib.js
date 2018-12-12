const { parseInput, hasOption } = require("./parser.js");
const { checkHead, checkTail } = require("./errorHandler.js");

const extractHeadLines = function(file, numberOfLines) {
  return file.slice(0, numberOfLines).join("\n");
};

const extractHeadCharacters = function(file, numberOfCharacters) {
  return file.join("\n").slice(0, numberOfCharacters);
};

const extractTailLines = function(file, numberOfLines) {
  return file.slice(-numberOfLines).join("\n");
};

const extractTailCharacters = function(file, numberOfCharacters) {
  return file.join("\n").slice(-numberOfCharacters);
};

const singleFileData = function(file, details) {
  let { existsSync, readFileSync, count, funcRef, operation } = details;
  if (!existsSync(file)) {
    return operation + ": " + file + ": No such file or directory";
  }
  return funcRef(readFileSync(file, "utf8").split("\n"), count);
};

const retrieveData = function(details, fileName) {
  let {
    delimeter,
    readFileSync,
    contents,
    existsSync,
    funcRef,
    count,
    operation
  } = details;
  if (!existsSync(fileName)) {
    contents.push(operation + ": " + fileName + ": No such file or directory");
    return details;
  }
  contents.push(delimeter + "==> " + fileName + " <==");
  contents.push(funcRef(readFileSync(fileName, "utf8").split("\n"), count));
  details.delimeter = "\n";
  return details;
};

const getContent = function(fileDetails, fs, operation) {
  let {readFileSync, existsSync} = fs;
  let { option, count, files } = parseInput(fileDetails);
  let reference = {head: {n: extractHeadLines, c: extractHeadCharacters}, tail: {n: extractTailLines, c:extractTailCharacters} };
  let funcRef = reference[operation][option]; 
  let details = {
    contents: [],
    existsSync,
    count: parseInt(count),
    funcRef,
    readFileSync,
    operation,
    delimeter: ""
  };

  if (files.length == 1) {
    console.log(singleFileData(files[0], details));
    return singleFileData(files[0], details);
  }
  return files.reduce(retrieveData, details).contents.join("\n");
};

const head = function(fileDetails, fs) {
  let { option, count, files } = parseInput(fileDetails);
  if (checkHead(fileDetails, count, option) != undefined) {
    return checkHead(fileDetails, count, option);
  }
  return getContent(fileDetails, fs, "head");
};

const tail = function(fileDetails, fs) {
  let { option, count, files } = parseInput(fileDetails);
  if (checkTail(fileDetails, count, files) != undefined) {
    return checkTail(fileDetails, count, files);
  }
  return getContent(fileDetails, fs, "tail");
};

module.exports = {
  extractHeadLines,
  extractHeadCharacters,
  head,
  hasOption,
  extractTailLines,
  extractTailCharacters,
  tail,
  retrieveData,
  checkHead,
  checkTail,
  getContent
};
