import {statSync} from 'fs'
import {sortBy} from 'lodash'
import {availableParallelism} from 'os'
import {join} from 'path'
import {pathToFileURL} from 'url'
import type {Reply} from './compileWorker'
import {E2E_DIR, getTestCases} from './e2eCases'

/**
 * compile() is CPU-bound, and a couple of the realWorld.* fixtures take seconds
 * each. So rather than each suite compiling each case inline, the e2e and
 * typecheck suites share one compile per test case (bun evaluates this module
 * once for the whole run), and those compiles run on a pool of worker threads
 * (./compileWorker.ts). Tests still run -- and record their snapshots -- one
 * at a time in the usual order; each just awaits its case's output here.
 *
 * Cases that are expected to throw aren't pooled: the e2e suite asserts on the
 * rejection value itself, so it calls compile() directly for those.
 */
export function compileTestCase(name: string): Promise<string> {
  pool ??= startPool()
  return pool(name)
}

let pool: ((name: string) => Promise<string>) | undefined

function startPool() {
  // Queue every case, largest fixture first, so the slowest compiles start right
  // away. A test that asks for a case nobody has picked up yet moves it to the
  // front, so a filtered run (`bun test -t`) doesn't wait behind the big ones
  // (and bun doesn't wait for the workers still busy with them when it exits).
  const queue = sortBy(
    getTestCases()
      .filter(([, testCase]) => !testCase.error)
      .map(([name]) => name),
    name => -statSync(join(E2E_DIR, name)).size,
  )

  const replies = new Map(queue.map(name => [name, Promise.withResolvers<Reply>()]))

  function next(worker: Worker) {
    const name = queue.shift()
    if (name === undefined) {
      worker.terminate()
    } else {
      worker.postMessage(name)
    }
  }

  // Half the logical CPUs measured faster than all of them on a 4-vCPU machine:
  // beyond two or three workers the biggest fixture is the critical path anyway,
  // and extra workers only slow it down.
  const size = Math.min(queue.length, Math.max(2, Math.floor(availableParallelism() / 2)))
  for (let i = 0; i < size; i++) {
    const worker = new Worker(pathToFileURL(join(__dirname, 'compileWorker.ts')))
    worker.onmessage = ({data}: MessageEvent<Reply>) => {
      replies.get(data.name)!.resolve(data)
      next(worker)
    }
    worker.onerror = e => replies.forEach((_, name) => _.resolve({name, error: e.message}))
    // Hand out the first jobs on the next tick, so the case that started the pool
    // (moved to the front below) goes first rather than waiting behind the largest.
    queueMicrotask(() => next(worker))
  }

  return async (name: string): Promise<string> => {
    const queued = queue.indexOf(name)
    if (queued > 0) {
      queue.unshift(...queue.splice(queued, 1))
    }
    const reply = await replies.get(name)!.promise
    if ('error' in reply) {
      throw new Error(reply.error)
    }
    return reply.output
  }
}
