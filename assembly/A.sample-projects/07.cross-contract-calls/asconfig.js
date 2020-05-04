const compile = require("near-sdk-as/compiler").compile;

function compileContract(name) {
  console.log(`\ncompiling contract [ ${name}.ts ] to [ out/${name}.wasm ]`);

  compile(
    `assembly/${name}/main.ts`, // input file
    `out/${name}.wasm`, // output file
    [
      // add optional args here
      // "-O3z",
      "--debug", // Shows debug output
      "--measure", // Shows compiler run time
      "--validate", // Validate the generated wasm module
    ],
    {
      verbose: false, // Output the cli args passed to asc
    }
  );
}

compileContract("sentences");
compileContract("words");
