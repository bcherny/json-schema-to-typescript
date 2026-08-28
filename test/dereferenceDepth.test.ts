import {describe, expect, test} from 'bun:test'
import {join} from 'path'
import {pathToFileURL} from 'url'
import {compile, Options} from '../src'
import {JSONSchema} from '../src/types/JSONSchema'
import type {Job, Reply} from './compileApart'
import {hasOnly} from './e2eCases'

const suite = hasOnly() ? describe.skip : describe

// Two `$ref`s with sibling keywords ("extended" refs) that point at the same container, one from
// outside it and one from inside it. json-schema-ref-parser 11 merges an extended ref's target
// into a fresh object on every visit, so it never recognises the inner one as a cycle and nests
// without end: #/properties/outer/inner/inner/inner/… until the stack overflows.
const undetectedCycle: JSONSchema = {
  title: 'UndetectedCycle',
  type: 'object',
  properties: {
    outer: {$ref: '#/definitions/container', additionalProperties: false},
  },
  definitions: {
    container: {
      inner: {$ref: '#/definitions/container', additionalProperties: false},
    },
  },
}

// The same, plus a self-referencing `$ref` in the container that is first reached from somewhere
// else. Now every level of nesting also re-resolves an ever longer pointer, and the stack overflow
// that would otherwise end it within a second is minutes to hours of CPU away: compile() does not
// come back. Found by fuzzing.
const undetectedCycleThatNeverReturns: JSONSchema = {
  title: 'UndetectedCycleThatNeverReturns',
  type: 'object',
  properties: {
    first: {$ref: '#/definitions/container/self'},
    outer: {$ref: '#/definitions/container', additionalProperties: false},
  },
  definitions: {
    container: {
      self: {$ref: '#/definitions/container/self'},
      inner: {$ref: '#/definitions/container', additionalProperties: false},
    },
  },
}

function nested(depth: number): JSONSchema {
  return depth === 0
    ? {type: 'string'}
    : {type: 'object', properties: {next: nested(depth - 1)}, additionalProperties: false}
}

const withMaxDepth = (maxDepth: number): Partial<Options> => ({$refOptions: {dereference: {maxDepth}}})

/**
 * compile() on a worker thread, given up on (and the worker stopped) after `ms`: a compile that
 * spins on the CPU never yields to a test timeout on its own thread. Resolves with the output,
 * or rejects with the worker's error.
 */
async function compileApart(job: Job, ms: number): Promise<string> {
  const worker = new Worker(pathToFileURL(join(__dirname, 'compileApart.ts')))
  try {
    const reply = await new Promise<Reply>((resolve, reject) => {
      worker.onmessage = ({data}: MessageEvent<Reply>) => resolve(data)
      worker.onerror = e => reject(new Error(e.message))
      setTimeout(() => reject(new Error(`compile() did not return within ${ms} ms`)), ms)
      worker.postMessage(job)
    })
    if ('error' in reply) {
      throw new Error(reply.error)
    }
    return reply.output
  } finally {
    worker.terminate()
  }
}

suite('dereference', () => {
  test('a $ref cycle the ref resolver cannot detect is reported, naming where it runs away', async () => {
    await expect(compile(undetectedCycle, 'UndetectedCycle')).rejects.toThrow(
      /deeper than 500 levels at #\/properties\/outer\/inner\/inner\/inner\/.*sibling keywords/,
    )
  })

  test('including the variant that otherwise never returns', async () => {
    await expect(
      compileApart({schema: undetectedCycleThatNeverReturns, name: 'Never', options: withMaxDepth(150)}, 10_000),
    ).rejects.toThrow('deeper than 150 levels')
  }, 15_000)

  test('schemas that merely nest deeply still compile, up to $refOptions.dereference.maxDepth', async () => {
    expect(await compile(nested(120), 'Deep', {format: false})).toContain('next?: string')
    await expect(compile(nested(120), 'Deep', {format: false, ...withMaxDepth(60)})).rejects.toThrow(
      'deeper than 60 levels',
    )
  })
})
