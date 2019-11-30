import {format as prettify} from 'prettier'
import {Options} from './'

export function format(code: string, options: Options): string {
  return prettify(code, {parser: 'typescript', ...options.style})
}
