import test from 'ava'
import {execSync} from 'child_process'
import {readFileSync, unlinkSync, readdirSync, existsSync, lstatSync} from 'fs'
import {resolve, posix} from 'path'
import rimraf = require('rimraf')

export function run() {
  test('pipe in, pipe out', t => {
    t.snapshot(
      execSync('shx cat ./test/resources/ReferencedType.json | node dist/cli.cjs', {encoding: 'utf-8'}).toString(),
    )
  })

  test('pipe in (schema without ID), pipe out', t => {
    t.snapshot(
      execSync('shx cat ./test/resources/ReferencedTypeWithoutID.json | node dist/cli.cjs', {
        encoding: 'utf-8',
      }).toString(),
    )
  })

  test('file in (no flags), pipe out', t => {
    t.snapshot(execSync('node dist/cli.cjs ./test/resources/ReferencedType.json').toString())
  })

  test('file in (--input), pipe out', t => {
    t.snapshot(execSync('node dist/cli.cjs --input ./test/resources/ReferencedType.json').toString())
  })

  test('file in (-i), pipe out', t => {
    t.snapshot(execSync('node dist/cli.cjs -i ./test/resources/ReferencedType.json').toString())
  })

  test('file in (-i), unreachable definitions flag, pipe out', t => {
    t.snapshot(
      execSync('node dist/cli.cjs -i ./test/resources/DefinitionsOnly.json --unreachableDefinitions').toString(),
    )
  })

  test('file in (-i), style flags, pipe out', t => {
    t.snapshot(
      execSync('node dist/cli.cjs -i ./test/resources/Enum.json --style.singleQuote --no-style.semi').toString(),
    )
  })

  test('file in (-i), pipe out (absolute path)', t => {
    t.snapshot(execSync(`node dist/cli.cjs -i ${__dirname}/../test/resources/ReferencedType.json`).toString())
  })

  test('pipe in, file out (--output)', t => {
    execSync('shx cat ./test/resources/ReferencedType.json | node dist/cli.cjs --output ./ReferencedType.d.ts')
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('pipe in, file out (-o)', t => {
    execSync('shx cat ./test/resources/ReferencedType.json | node dist/cli.cjs -o ./ReferencedType.d.ts')
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (no flags), file out (no flags)', t => {
    execSync('node dist/cli.cjs ./test/resources/ReferencedType.json ./ReferencedType.d.ts')
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (-i), file out (-o)', t => {
    execSync('node dist/cli.cjs -i ./test/resources/ReferencedType.json -o ./ReferencedType.d.ts')
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('file in (--input), file out (--output)', t => {
    execSync('node dist/cli.cjs --input ./test/resources/ReferencedType.json --output ./ReferencedType.d.ts')
    t.snapshot(readFileSync('./ReferencedType.d.ts', 'utf-8'))
    unlinkSync('./ReferencedType.d.ts')
  })

  test('--unknownAny', t => {
    t.snapshot(execSync('node dist/cli.cjs --unknownAny=false --input ./test/resources/ReferencedType.json').toString())
  })

  test('--additionalProperties', t => {
    t.snapshot(
      execSync(
        'node dist/cli.cjs --additionalProperties=false --input ./test/resources/ReferencedType.json',
      ).toString(),
    )
  })

  test('files in (-i), files out (-o)', t => {
    execSync(`node dist/cli.cjs -i "./test/resources/MultiSchema/**/*.json" -o ./test/resources/MultiSchema/out`)

    readdirSync('./test/resources/MultiSchema/out').forEach(f => {
      const path = `./test/resources/MultiSchema/out/${f}`
      t.snapshot(path)
      t.snapshot(readFileSync(path, 'utf-8'))
      unlinkSync(path)
    })
    rimraf.sync('./test/resources/MultiSchema/out')
  })

  test('files in (-i), pipe out', t => {
    t.snapshot(execSync(`node dist/cli.cjs -i "./test/resources/MultiSchema/**/*.json"`).toString())
  })

  test('files in (-i), files out (-o) nested dir does not exist', t => {
    execSync(
      `node dist/cli.cjs -i "./test/resources/MultiSchema/**/*.json" -o ./test/resources/MultiSchema/foo/bar/out`,
    )
    readdirSync('./test/resources/MultiSchema/foo/bar/out').forEach(f => {
      const path = `./test/resources/MultiSchema/foo/bar/out/${f}`
      t.snapshot(path)
      t.snapshot(readFileSync(path, 'utf-8'))
      unlinkSync(path)
    })
    rimraf.sync('./test/resources/MultiSchema/foo')
  })

  test('files in (-i), files out (-o) matching nested dir', t => {
    execSync(
      `node dist/cli.cjs -i "./test/resources/../../test/resources/MultiSchema2/" -o ./test/resources/MultiSchema2/out`,
    )
    getPaths('./test/resources/MultiSchema2/out').forEach(file => {
      t.snapshot(file)
      t.snapshot(readFileSync(file, 'utf-8'))
      unlinkSync(file)
    })
    rimraf.sync('./test/resources/MultiSchema2/out')
  })
}

function getPaths(path: string, paths: string[] = []) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(resolve(path)).forEach(item => getPaths(posix.join(posix.normalize(path), item), paths))
  } else {
    paths.push(path)
  }

  // sort paths to ensure a stable order across environments
  return paths.sort((a, b) => a.localeCompare(b))
}
