#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

var pkg = require('../package.json');

var lib = require('../dist/index.js');
var compileFromFile = lib.compileFromFile;

program
  .version(pkg.version)
  .command('json-schema-to-typescript <in> [out]', 'convert a JSON-schema <in> file and output a TypeScript [out] file, or stdout if [out] file is not specified')
  .action(function (inFile, outFile) {
    outFile = (typeof outFile === 'string' ? outFile : null);

    return compileFromFile(inFile).then(function (output) {
      if (!outFile) {
        console.log(output);
        process.exit(0);
      }

      return fs.writeFileSync(outFile, output);
    }, function () {
      console.error('Could not compile from JSON-schema file', inFile);
      process.exit(-1);
    });
  })
  .parse(process.argv);
