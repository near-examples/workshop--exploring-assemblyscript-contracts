const fs = require("fs");
const path = require("path");
const util = require("util");

const compile = require("near-sdk-as/compiler").compile;
const asc = require("near-sdk-as/compiler").asc;

// main folder that includes all projects used in this workshop
const PROJECTS_DIR = "sample-projects";

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

    scanProjects().map(compileOptimized);

    break;

  case process.cwd():
    // we're using a specific contract package.json
    // we know this because we've appended $(pwd) to yarn build for each contract in its local package.json

    compileReadable(`${process.cwd()}/main.ts`, { relPath: "../../../" });

    break;

  default:
    const projects = projectsNames();
    if (Object.keys(projects).includes(mode)) {
      compileOptimized(projects[mode], {});
    } else {
      throw new Error(
        `Unexpected condition in build process.\nLast argument was [${mode}]`
      );
    }
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
  const output = folder.split(".")[1]; // greeting

  reportProgress(folder, output, false);

  asc.main(
    [
      fqPath,
      "--binaryFile",
      `${relPath}out/${output}.wasm`,
      "-O3z", // optimize for size and speed
      "--validate", // validate the generated wasm module
      "--runPasses",
      "inlining-optimizing,dce", // inlines to optimize and removes deadcode
      "--measure", // shows compiler run time
    ],
    { verbose: false } // output the cli args passed to asc
  );

  reportFilesize(`${relPath}out/${output}.wasm`);
}

/**
 * Compiles the most readable Wasm file and WAT file for learning and readability
 * @param {string} fqPath
 * @param {object} options currently `relPath` to help direct files to the right output folder
 */
function compileReadable(fqPath, { relPath = "" }) {
  const folder = path.dirname(fqPath).split("/").pop(); // 01.greeting
  const output = folder.split(".")[1]; // greeting

  reportProgress(folder, output, true);

  compile(
    fqPath, // input file
    `out/${output}.wasm`, // output file
    [
      "--validate", // validate the generated wasm module
      "--measure", // shows compiler run time
    ],
    { verbose: false } // output the cli args passed to asc
  );
}

/**
 * List all files in a directory recursively in a synchronous fashion
 * adapted from https://gist.github.com/kethinov/6658166#gistcomment-2109513
 * @param {string} dir top level to begin recursive descent through gstall subfolders
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

function reportFilesize(fqPath) {
  const stats = fs.statSync(fqPath);
  console.log(`Filesize  : ${stats.size / 1000.0}kb`);
}

function scanProjects() {
  return readDirR(path.resolve(__dirname, "assembly")) // only AssemblyScript files
    .filter((fqPath) => fqPath.includes(PROJECTS_DIR)) // in the A.scavenger-hunt folder
    .filter((fqPath) => fqPath.includes("main.ts")); // just the contract entry points
}

function projectsNames() {
  const projects = scanProjects();
  const re = new RegExp(`${PROJECTS_DIR}\/\\d{2}.([A-Za-z]*)`);
  return projects.reduce((result, path) => {
    let match = path.match(re);
    result[match[1]] = match.input;
    return result;
  }, {});
}
