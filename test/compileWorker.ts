// Worker side of ./compilePool.ts: receives a test case's file name, replies with compile()'s output.
import {compile} from '../src'
import {stripExtension} from '../src/utils'
import {getOptions, loadTestCase} from './e2eCases'

export type Reply = {name: string} & ({output: string} | {error: string})

declare const self: Worker

self.onmessage = async ({data: name}: MessageEvent<string>) => {
  let reply: Reply
  try {
    const testCase = loadTestCase(name)
    reply = {name, output: await compile(testCase.input, stripExtension(name), getOptions(testCase))}
  } catch (e) {
    reply = {name, error: e instanceof Error ? (e.stack ?? e.message) : String(e)}
  }
  self.postMessage(reply)
}
