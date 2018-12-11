const errors = {
  illegalOption: "head: illegal option -- ",
  usageMessage: "usage: head [-n lines | -c bytes] [file ...]",
  invalidLineCount: "head: illegal line count -- ",
  invalidByteCount: "head: illegal byte count -- "
};

const hasOption = function(option) {
  return option == "-c" || option == "-n";
};

const hasDash = function(option) {
  return option.includes("-");
};

const isZero = function(value) {
  return value == 0;
};

const invalidCount = function(option, count, functionName) {
  return option == "n"
    ? errors.invalidLineCount + count
    : errors.invalidByteCount + count;
};

const hasOtherCharacters = function(fileDetails) {
  return (
    hasDash(fileDetails[0][0]) &&
    fileDetails[0][1] != "c" &&
    fileDetails[0][1] != "n" &&
    !parseInt(fileDetails[0])
  );
};

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

const parseInput = function(args) {
  let organizedInput = { option: "n", count: 10, files: args.slice(0) };
  if (hasOption(args[0])) {
    organizedInput = {
      option: args[0][1],
      count: parseInt(args[1]),
      files: args.slice(2)
    };
  }
  if (args[0].length > 2 && hasDash(args[0])) {
    organizedInput = {
      option: args[0].slice(1, 2),
      count: args[0].slice(2),
      files: args.slice(1)
    };
  }
  if (parseInt(args[0])) {
    organizedInput = {
      option: "n",
      count: Math.abs(args[0]),
      files: args.slice(1)
    };
  }
  return organizedInput;
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

  if (isZero(fileDetails[0]) || count == 0) {
    return errors.invalidLineCount + "0";
  }

  if (isNaN(count - 0) || count < 1) {
    return invalidCount(option, count);
  }

  if (hasOtherCharacters(fileDetails)) {
    return (
      errors.illegalOption + fileDetails[0][1] + "\n" + errors.usageMessage
    );
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
  parseInput,
  retrieveData,
  head,
  isZero,
  invalidCount,
  hasDash,
  hasOption,
  extractTailLines,
  extractTailCharacters,
  tail,
  hasOtherCharacters
};
