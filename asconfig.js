const compile = require("near-sdk-as/compiler").compile

const fs = require('fs')
const path = require('path')

function readDirR(dir) {
  return fs.statSync(dir).isDirectory() ? [Array.prototype].concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f)))) :
    dir;
}

readDirR(path.resolve(__dirname, "assembly"))   // only AssemblyScript files
  .filter(fqPath => fqPath.includes("A."))      // in the A.scavenger-hunt folder
  .filter(fqPath => fqPath.includes("main.ts")) // just the contracts entry point
  .map(compileContract)

function compileContract(fqPath) {
  const folder = path.dirname(fqPath).split("/").pop() // 01.greeting
  const output = folder.split(".")[1] // greeting

  console.log(`\ncompiling contract [ ${folder}/main.ts ] to [ out/${output}.wasm ]`)

  compile(`${fqPath}`,                // input file
          `out/${output}.wasm`,       // output file
          [                           // add optional args here

            // "-O3z",                // Optimize for size and speed
            "--debug",                // Shows debug output
            // "--measure",           // Shows compiler run time
            "--validate"              // Validate the generated wasm module

          ], 
          {
            verbose: false            // Output the cli args passed to asc
          }
  );
}

/**************************************************************
  NEAR relies on AssemblyScript to optimize file size and 
  execution speed which makes for more cost effective contracts
***************************************************************

To make the contract in this project as small and fast as 
possible just add the following optional argument to the 
compile() methods 3rd argument, the array of optional args

-O3z --converge

So the above call to compile() would change to this: 

compile("assembly/main.ts", // input file
        "out/main.wasm",    // output file
        [                   // add optional args here

          "-O3z"            // Optimize for size and speed
          "--converge"      // Converges on maximal optimization

          "--debug",        // Shows debug output
          "--measure",      // Shows compiler run time
          "--validate"      // Validate the generated wasm module
        ], {
          verbose: false    // Output the cli args passed to asc
        });

***************************************************************

All optional arguments are documented on this page 
https://docs.assemblyscript.org/details/compiler

with the relevant example about optimizing for size and speed 
included below as well

--optimize, -O    Optimizes the module.Typical shorthands are:

                  Default optimizations   -O / -O3s
                  Make a release build    -O --noAssert
                  Make a debug build      --debug
                  Optimize for speed      -O3
                  Optimize for size       -O3z --converge

--optimizeLevel   How much to focus on optimizing code.[0 - 3]
--shrinkLevel     How much to focus on shrinking code size.[0 - 2, s = 1, z = 2]
--converge        Re-optimizes until no further improvements can be made.
--noAssert        Replaces assertions with just their value without trapping

*/