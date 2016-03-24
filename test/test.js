import test from 'ava'
import {compileFromFile} from '../'
import {equal} from 'assert'
import {readFileSync} from 'fs'

test('basics', async t => t.is(
  await compileFromFile('./basics/basics.json'),
  readFileSync('./basics/basics.d.ts').toString()
))