const errorMessages = {
  illegalOption: "head: illegal option -- ",
  usageMessage: "usage: head [-n lines | -c bytes] [file ...]",
  invalidLineCount: "head: illegal line count -- ",
  invalidByteCount: "head: illegal byte count -- "
};

const extractLines = function(file, numberOfLines) {
  return file.slice(0, numberOfLines).join("\n");
};

const extractCharacters = function(file, numberOfCharacters) {
  return file.join("\n").slice(0, numberOfCharacters);
};

const parseInput = function(args) {
  let organizedInput = { option: "n", count: 10, files: args.slice(0) };
  if (args[0] == "-c" || args[0] == "-n") {
    organizedInput = {
      option: args[0][1],
      count: parseInt(args[1]),
      files: args.slice(2)
    };
  }
  if (args[0].length > 2 && args[0].includes("-")) {
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
    count
  } = details;
  if (!existsSync(fileName)) {
    contents.push("head: " + fileName + ": No such file or directory");
    return details;
  }
  contents.push(delimeter + "==> " + fileName + " <==");
  contents.push(funcRef(readFileSync(fileName, "utf8").split("\n"), count));
  details.delimeter = "\n";
  return details;
};

const getContent = function(fileDetails, existsSync, readFileSync) {
  let { option, count, files } = parseInput(fileDetails);
  let getReference = { n: extractLines, c: extractCharacters };
  let funcRef = getReference[option];
  let details = {
    contents: [],
    existsSync,
    count,
    funcRef,
    readFileSync,
    delimeter: ""
  };
  if (files.length == 1) {
    if (!existsSync(files[0])) {
      return "head: " + files[0] + ": No such file or directory";
    }
    return funcRef(readFileSync(files[0], "utf8").split("\n"), count);
  }
  return files.reduce(retrieveData, details).contents.join("\n");
};

const head = function(fileDetails, fs) {
  const { existsSync, readFileSync } = fs;
  let { option, count, files } = parseInput(fileDetails);
  if (fileDetails[0] == 0 || count == 0) {
    return errorMessages.invalidLineCount + "0";
  }
  if (isNaN(count - 0) || count < 1) {
    return option == "n"
      ? errorMessages.invalidLineCount + count
      : errorMessages.invalidByteCount + count;
  }
  if (
    fileDetails[0][0] == "-" &&
    fileDetails[0][1] != "c" &&
    fileDetails[0][1] != "n" &&
    !parseInt(fileDetails[0])
  ) {
    return (
      errorMessages.illegalOption +
      fileDetails[0][1] +
      "\n" +
      errorMessages.usageMessage
    );
  }
  return getContent(fileDetails, existsSync, readFileSync);
};

module.exports = {
  extractLines,
  extractCharacters,
  parseInput,
  retrieveData,
  head,
  getContent
};
