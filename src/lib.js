const errorMessage = 'head: illegal option -- ';

const usageMessage = 'usage: head [-n lines | -c bytes] [file ...]';

const invalidLineCount = 'head: illegal line count -- ';

const invalidByteCount = 'head: illegal byte count -- ';

const extractLines = function(file, numberOfLines) {
  return file.slice(0,numberOfLines).join("\n"); 
}

const extractCharacters = function(file, numberOfCharacters) {
  return file.join('\n').slice(0,numberOfCharacters);
}

const organizeInput = function(args) {
  let organizedInput = {option:"n", count:10, files:args.slice(2)};

  if(args[2]=="-c" || args[2]=="-n") {
    organizedInput = {option : args[2][1], count : parseInt(args[3]), files : args.slice(4)};
  }

  if(args[2].length>2 && args[2].includes('-')){
    organizedInput = { option : args[2].slice(1,2), count : args[2].slice(2), files : args.slice(3)};
  }

  if(parseInt(args[2])){
    organizedInput = { option : "n", count : Math.abs(args[2]), files : args.slice(3)};
  }

  return organizedInput;
}

const fetchData = function(details, fileName){
  let {delimeter, readContent, output, validater, funcRef, count} = details;
  if (!validater(fileName)) {
    output.push('head: '+fileName+': No such file or directory');
    return details;
  }
  output.push(delimeter + '==> '+ fileName +' <==')
  output.push(funcRef(readContent(fileName,'utf8').split('\n'),count));
  details.delimeter = "\n";
  return details;
}

const getContent = function(fileDetails, validater, readContent) {
  let {option,count,files} = organizeInput(fileDetails);
  let getReference = {'n': extractLines , 'c': extractCharacters};
  let funcRef = getReference[option];
  let details = {output : [],validater, count , funcRef, readContent, delimeter:''}; 
  if(files.length == 1){
    if(!validater(files[0])){ return 'head: '+files[0]+': No such file or directory'};
    return funcRef(readContent(files[0],'utf8').split('\n'),count);
  }
  return files.reduce(fetchData, details).output.join("\n");

}

const head = function(fileDetails,validater,readContent){
  let {option,count,files} = organizeInput(fileDetails);
  if(fileDetails[2]== 0 || count==0){
    return invalidLineCount + "0";
  }

  if (isNaN(count - 0) || count < 1) {
    return (option == 'n') ? invalidLineCount + count : invalidByteCount + count;
  } 

  if (fileDetails[2][0]=='-' && fileDetails[2][1] != 'c' && fileDetails[2][1] != 'n' && !parseInt(fileDetails[2])) {
    return errorMessage + fileDetails[2][1] + '\n' + usageMessage;
  }
  return getContent(fileDetails, validater, readContent);
}

module.exports = {
  extractLines,
  extractCharacters,
  organizeInput,
  fetchData,
  head,
  getContent
};
