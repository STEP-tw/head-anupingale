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

  if(parseInt(args[2])){
    organizedInput = { option : "n", count : Math.abs(args[2]), files : args.slice(3)};
  }

  if(args[2].length>2 && args[2].includes('-')){
    organizedInput = { option : args[2].slice(1,2), count : parseInt(args[2].slice(2,args[2].length)), files : args.slice(3)};
  }
  return organizedInput;
}
 

module.exports = {
  extractLines,
  extractCharacters,
  organizeInput
};
