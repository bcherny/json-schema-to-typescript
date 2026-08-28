// Worker side of `compileApart` (./dereferenceDepth.test.ts): compiles the schema it is handed and replies
// with the output or the error message -- so a compile() that never returns can be given up on.
import {compile, Options} from '../src'
import {JSONSchema} from '../src/types/JSONSchema'

export type Job = {schema: JSONSchema; name: string; options?: Partial<Options>}
export type Reply = {output: string} | {error: string}

declare const self: Worker

self.onmessage = async ({data: {schema, name, options}}: MessageEvent<Job>) => {
  let reply: Reply
  try {
    reply = {output: await compile(schema, name, options)}
  } catch (e) {
    reply = {error: e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e)}
  }
  self.postMessage(reply)
}
