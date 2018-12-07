const {readFileSync, existsSync} = require("fs");
const { head } = require("./src/lib.js");

const main = function(args) {
  console.log(head(args.slice(2), existsSync, readFileSync));
}

main(process.argv)
