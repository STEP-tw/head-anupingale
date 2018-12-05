const extractLines = function(file, numberOfLines) {
  return file.slice(0,numberOfLines).join("\n"); 
}

module.exports = {extractLines};
