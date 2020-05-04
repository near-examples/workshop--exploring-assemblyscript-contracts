module.exports = require("near-sdk-as/imports");
module.exports.include.push("**/*.spec.ts");

// // include tests for all folders under "/assembly" recursively since each one is a separate contract
// const fs = require('fs')
// const path = require('path')

// function readDirR(dir) {
//   return fs.statSync(dir).isDirectory()
//     ? [Array.prototype].concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
//     : dir;
// }

// readDirR(path.resolve(__dirname, "assembly"))
//   .filter(dir => !dir.includes("/."))
//   .filter(dir => dir.includes("__tests__"))
//   .map(dir => module.exports.include.push(dir))
