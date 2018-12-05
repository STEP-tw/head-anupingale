const readContent = require("fs").readFileSync;
const { head } = require("./src/lib.js");

const main = function(args) {
  console.log(head(args,readContent));
}

main(process.argv)
