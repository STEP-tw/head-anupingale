const extractLines = function(file, numberOfLines) {
  return file.slice(0,numberOfLines).join("\n"); 
}

const extractCharacters = function(file, numberOfCharacters) {
  return file.join('\n').slice(0,numberOfCharacters);
}

module.exports = {
  extractLines,
  extractCharacters
};
