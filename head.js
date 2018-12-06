const {readFileSync, existsSync} = require("fs");
const { head } = require("./src/lib.js");

const main = function(args) {
  console.log(head(args, existsSync, readFileSync));
}

main(process.argv)
