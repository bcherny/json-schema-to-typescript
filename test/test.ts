import { compile } from '../src/index'
import test from 'ava'
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
    exports.configurations.forEach((cfg: any) => {
      test(`${name}: ${JSON.stringify(cfg.settings)}`, t => {
        if (cfg.error) {
          t.throws(() => compile(cfg.schema, name, cfg.settings), cfg.error.type)
        } else {
          t.is(compile(exports.schema, name, cfg.settings), cfg.types)
        }
      })
    })
  } else {
    test(name, t => exports.error
      ? t.throws(() => compile(exports.schema, name, exports.settings), exports.error.type)
      : t.is(compile(exports.schema, name, exports.settings), exports.types)
    )
  }
})
