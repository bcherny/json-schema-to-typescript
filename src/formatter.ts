import {format as prettify} from 'prettier'
import {Options} from './'

export function format(code: string, options: Options): string {
  if (!options.format) {
    return code
  }
  const wrapStart = 'type A = '
  let formatted = prettify(wrapStart+code, {parser: 'typescript', ...options.style})
  formatted = formatted.slice(wrapStart.length);
  formatted = formatted.replace(/;\s*$/, '')
  return formatted
}
