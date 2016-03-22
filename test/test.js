import test from 'ava'
import {compileFromFile} from '../'
import {equal} from 'assert'
import {readFileSync} from 'fs'

test('basics', async t =>
  const a = compileFromFile('./basics/basics.json')
  t.is(await a, readFileSync('./basics/basics.d.ts'))
)