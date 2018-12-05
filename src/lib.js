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
    organizedInput = { option : args[2].slice(1,2), count : parseInt(args[2].slice(2,args[2].length)), files : args.slice(3)};
  }

  if(parseInt(args[2])){
    organizedInput = { option : "n", count : Math.abs(args[2]), files : args.slice(3)};
  }

  return organizedInput;
}

const fetchData = function(details, fileName){
  let {delimeter, readContent, output, funcRef, count} = details;
  output.push(delimeter + '==> '+ fileName +' <==')
  output.push(funcRef(readContent(fileName,'utf8').split('\n'),count));
  details.delimeter = "\n";
  return details;
}

const head = function(fileDetails,readContent){
  let {option,count,files} = organizeInput(fileDetails);
  if(!count || fileDetails[2]=="-0") {
    return 'head: illegal line count -- 0';
  }

  let getReference = {'n': extractLines , 'c': extractCharacters};
  let funcRef = getReference[option];
  let details = {output : [], count , funcRef, readContent, delimeter:''}; 
  if(files.length == 1){
    return funcRef(readContent(files[0],'utf8').split('\n'),count);
  }
  return files.reduce(fetchData, details).output.join("\n");
}

module.exports = {
  extractLines,
  extractCharacters,
  organizeInput,
  fetchData,
  head
};
