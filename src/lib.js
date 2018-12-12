const { parseInput, hasOption } = require("./parser.js");
const { checkHead, checkTail } = require("./errorHandler.js");

const extractLines = function(file, numberOfLines) {
  return file.slice(0, numberOfLines).join("\n");
};

const extractCharacters = function(file, numberOfCharacters) {
  return file.join("\n").slice(0, numberOfCharacters);
};

const extractTailLines = function(file, numberOfLines) {
  return file.slice(-numberOfLines).join("\n");
};

const extractTailCharacters = function(file, numberOfCharacters) {
  return file.join("\n").slice(-numberOfCharacters);
};

const singleFileData = function(file, details) {
  let { existsSync, readFileSync, count, funcRef, funcName } = details;
  if (!existsSync(file)) {
    return funcName + ": " + file + ": No such file or directory";
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
    funcName
  } = details;
  if (!existsSync(fileName)) {
    contents.push(funcName + ": " + fileName + ": No such file or directory");
    return details;
  }
  contents.push(delimeter + "==> " + fileName + " <==");
  contents.push(funcRef(readFileSync(fileName, "utf8").split("\n"), count));
  details.delimeter = "\n";
  return details;
};

const head = function(fileDetails, fs) {
  const { existsSync, readFileSync } = fs;
  let { option, count, files } = parseInput(fileDetails);
  let getOutput = { n: extractLines, c: extractCharacters };
  let funcRef = getOutput[option];

  let details = {
    contents: [],
    existsSync,
    readFileSync,
    count: parseInt(count),
    funcRef,
    funcName: "head",
    delimeter: ""
  };

  if (checkHead(fileDetails, count, option) != undefined) {
    return checkHead(fileDetails, count, option);
  }
  if (files.length == 1) {
    return singleFileData(files[0], {
      existsSync,
      readFileSync,
      count,
      funcRef,
      funcName: "head"
    });
  }
  return files.reduce(retrieveData, details).contents.join("\n");
};

const tail = function(fileDetails, fs) {
  const { existsSync, readFileSync } = fs;
  let { option, count, files } = parseInput(fileDetails);
  let getOutput = { n: extractTailLines, c: extractTailCharacters };
  let funcRef = getOutput[option];
  let details = {
    contents: [],
    existsSync,
    readFileSync,
    count: parseInt(count),
    funcRef,
    funcName: "tail",
    delimeter: ""
  };

  if (checkTail(fileDetails, count, files) != undefined) {
    return checkTail(fileDetails, count, files);
  }
  if (files.length == 1) {
    return singleFileData(files[0], {
      existsSync,
      readFileSync,
      count,
      funcRef,
      funcName: "tail"
    });
  }
  return files.reduce(retrieveData, details).contents.join("\n");
};

module.exports = {
  extractLines,
  extractCharacters,
  head,
  hasOption,
  extractTailLines,
  extractTailCharacters,
  tail,
  retrieveData,
  checkHead,
  checkTail
};
