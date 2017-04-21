import { green, red } from 'cli-color'
import fastDiff = require('fast-diff')

export function diff(a: string, b: string) {
  return fastDiff(b, a).map((edit: fastDiff.Edit) => {
    if (edit[0] === fastDiff.INSERT) {
      return green(showHiddenChars(edit[1]))
    } else if (edit[0] === fastDiff.DELETE) {
      return red(showHiddenChars(edit[1]))
    } else {
      return edit[1]
    }
  }).join('')
}

/**
 * Show newline and space characters so they can be more easily visually diffed
 */
function showHiddenChars(a: string): string {
  return a
    .replace(/\r/g, '(\\r)\r')
    .replace(/\n/g, '(\\n)\n')
    .replace(/ /g, '˽')
}
