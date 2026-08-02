import {describe, expect, test} from 'bun:test'
import {execFileSync} from 'child_process'
import {JSONSchema4} from 'json-schema'
import {compile} from '../src'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

const SCHEMA: JSONSchema4 = {title: 'A', type: 'object', properties: {a: {type: 'string'}}}

// Runs in a child node process because both signals are process-wide, and other tests in this process have already loaded prettier.
// Two signals are needed: `require.cache` catches an eager `require`, and `node:v8` catches an eager `import`, which resolves prettier's ESM entry and so never reaches `require.cache`.
function loadSignalsWithFormatOff(): {prettierModules: number; loadedNodeV8: boolean} {
  const script = `
    const {compile} = require('./dist/src/index.js')
    compile(${JSON.stringify(SCHEMA)}, 'A', {format: false}).then(() => {
      console.log(JSON.stringify({
        prettierModules: Object.keys(require.cache).filter(p => /prettier/.test(p)).length,
        loadedNodeV8: process.moduleLoadList.includes('NativeModule v8'),
      }))
    })
  `
  return JSON.parse(execFileSync('node', ['-e', script], {encoding: 'utf-8'}))
}

suite('formatter', () => {
  test('format: false should not load prettier', () => {
    const {prettierModules, loadedNodeV8} = loadSignalsWithFormatOff()
    expect(prettierModules).toBe(0)
    expect(loadedNodeV8).toBe(false)
  })

  // Guards the other half of the lazy import: prettier still has to resolve and run when formatting is on.
  test('format: true should still format', async () => {
    expect(await compile(SCHEMA, 'A', {format: true})).toMatch(/^ {2}a\?: string;$/m)
  })
})
