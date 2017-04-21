import { AssertContext } from 'ava'
import { bold, green, red, white } from 'cli-color'
import { diff } from './diff'

type Reporter = (a: string, b: string) => string

// // USEFUL FOR DEVELOPMENT
//
// const tableReporter: Reporter = (a: string, b: string) => {
//   const Table = require('table-layout')
//   const table = new Table(
//     [
//       {
//         expected: bold('Expected') + '\n\n' + b,
//         actual: bold('Actual') + '\n\n' + a
//       }
//     ],
//     { columns: [{ width: 80 }, { width: 80 }], noTrim: true }
//   )
//   return table.toString()
// }

const diffReporter: Reporter = (a: string, b: string) => diff(a, b)

export function compare(t: AssertContext, caseName: string, a: string, b: string) {
  if (a !== b) {
    console.log(
      '\n',
      '─────────────────────────────────────────────────────────',
      '\n',
      bold(red(`${caseName} failed`)),
      '\n',
      '\n',
      green('Green') + white(' = Extraneous character in output'),
      '\n',
      '  ' + red('Red') + white(' = Missing character in output'),
      '\n',
      '\n',
      diffReporter(a, b),
      '─────────────────────────────────────────────────────────'
    )
    t.fail()
  } else {
    t.pass()
  }
}
