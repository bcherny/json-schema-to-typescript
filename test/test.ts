import {expect} from 'chai';
import {compile} from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

var modules = new Map<string, any>();
var dir = __dirname + "/cases";
fs.readdirSync(dir).forEach(function(moduleName) {
  if (!/^.*\.js$/.test(moduleName))
    return;
  var p = path.join(dir, moduleName);
  try {
    let module = require(p);
    modules.set(moduleName, module);
  } catch(e) {
    console.error("Unable to load module", moduleName, e);
  }
});
modules.forEach((exports, name) => {
  
  if (exports.configurations) {
    describe(name, function() {
      exports.configurations.forEach((cfg: any) => {
        it(JSON.stringify(cfg.settings), () => {
          expect(compile(exports.schema, cfg.settings)).to.be.equal(cfg.types);
        });
      });
    });
  }
  else {
    describe(name, function() {
      it("default settings", () => {
        expect(compile(exports.schema, exports.settings)).to.be.equal(exports.types);
      });
    });
  }
});