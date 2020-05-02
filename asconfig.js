const fs = require("fs");
const path = require("path");
const util = require("util");

const compile = require("near-sdk-as/compiler").compile;
const asc = require("near-sdk-as/compiler").asc;
/**
 * This file chooses one of two ways to compile AssemblyScript contracts
 *
 * - compileReadable() produces an unoptimized Wasm and WAT file for exploration
 * - compileOptimized() produces a highly optimized Wasm file to minimize on-chain execution costs
 */

const mode = process.argv.pop();
switch (mode) {
  case __filename:
    // we're using main package.json so build all contracts matching filters below

    readDirR(path.resolve(__dirname, "assembly"))       // only AssemblyScript files
      .filter((fqPath) => fqPath.includes("A."))        // in the A.scavenger-hunt folder
      .filter((fqPath) => fqPath.includes("main.ts"))   // just the contract entry points
      .map(compileOptimized);

    break;

  case process.cwd():
    // we're using a specific contract package.json
    // we know this because we've appended $(pwd) to yarn build for each contract in its local package.json

    compileReadable(`${process.cwd()}/main.ts`, { relPath: "../../../" });

    break;

  default:
    throw new Error(
      `Unexpected condition in build process.\nLast argument was [${mode}]`
    );
}

process.exit(0);

// ----------------------------------------------------------------------------
// Helper functions for the code above
// ----------------------------------------------------------------------------

/**
 * Compiles the most cost-effective Wasm file for deployment to NEAR Protocol
 * @param {string} fqPath
 * @param {object} options currently `relPath` to help direct files to the right output folder
 */
function compileOptimized(fqPath, { relPath = "" }) {
  const folder = path.dirname(fqPath).split("/").pop(); // 01.greeting
  const output = folder.split(".")[1];                  // greeting

  reportProgress(folder, output, false);

  asc.main(
    [
      fqPath,
      "--binaryFile",
      `${relPath}out/${output}.wasm`,
      "-O3z",                                           // optimize for size and speed
      "--validate",                                     // validate the generated wasm module
      "--runPasses",
      "inlining-optimizing,dce",                        // inlines to optimize and removes deadcode
    ],
    { verbose: false }                                  // output the cli args passed to asc
  );
}

/**
 * Compiles the most readable Wasm file and WAT file for learning and readability
 * @param {string} fqPath
 * @param {object} options currently `relPath` to help direct files to the right output folder
 */
function compileReadable(fqPath, { relPath = "" }) {
  const folder = path.dirname(fqPath).split("/").pop(); // 01.greeting
  const output = folder.split(".")[1];                  // greeting

  reportProgress(folder, output, true);

  compile(
    fqPath,                                             // input file
    `out/${output}.wasm`,                               // output file
    [
      "--measure",                                      // shows compiler run time
      "--validate",                                     // validate the generated wasm module
    ],
    { verbose: true }                                   // output the cli args passed to asc
  );
}

/**
 * List all files in a directory recursively in a synchronous fashion
 * adapted from https://gist.github.com/kethinov/6658166#gistcomment-2109513
 * @param {string} dir top level to begin recursive descent through all subfolders
 */
function readDirR(dir) {
  return fs.statSync(dir).isDirectory()
    ? [].concat(...fs.readdirSync(dir).map((f) => readDirR(path.join(dir, f))))
    : dir;
}

/**
 * Formats compiler output nicely
 */
function reportProgress(folder, output, includeWAT) {
  const padding = includeWAT ? 0 : 20 - folder.length;
  console.log(
    `compiling contract [ ${folder}/main.ts${" ".padStart(
      padding
    )}] to [ out/${output}.${includeWAT ? "{wasm,wat}" : "wasm"} ] `
  );
}
