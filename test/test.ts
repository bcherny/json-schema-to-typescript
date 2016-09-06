import { compile } from '../src/index'
import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'

var modules = new Map<string, any>()
var dir = __dirname + '/cases'
fs.readdirSync(dir).forEach(function(moduleName) {
  if (!/^.*\.js$/.test(moduleName))
    return
  var p = path.join(dir, moduleName)
  try {
    let module = require(p)
    modules.set(moduleName, module)
  } catch (e) {
    console.error('Unable to load module', moduleName, e)
  }
})
modules.forEach((exports, name) => {
  if (exports.configurations) {
    describe(name, function() {
      exports.configurations.forEach((cfg: any) => {
        it(JSON.stringify(cfg.settings), () => {
          if (cfg.error){
            expect(() => compile(cfg.schema, name, cfg.settings) ).to.throw(cfg.error.type, cfg.error.message)
          } else {
            expect(compile(exports.schema, name, cfg.settings)).to.be.equal(cfg.types)
          }
        })
      })
    })
  } else {
    describe(name, function() {
      it('default settings', () => {
        if (exports.error){
          expect(() => compile(exports.schema, name, exports.settings) ).to.throw(exports.error.type, exports.error.message)
        } else {
          expect(compile(exports.schema, name, exports.settings)).to.be.equal(exports.types)
        }
      })
    })
  }
})
