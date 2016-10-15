import { green, red } from 'cli-color'
const genericDiff = require('generic-diff')

interface Edit {
  added: boolean
  items: string[]
  removed: boolean
}

export function diff(a: string, b: string) {
  return genericDiff(b, a).map((edit: Edit) => {
    if (edit.added) {
      return green(showHiddenChars(edit.items.join('')))
    } else if (edit.removed) {
      return red(showHiddenChars(edit.items.join('')))
    } else {
      return edit.items.join('')
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
