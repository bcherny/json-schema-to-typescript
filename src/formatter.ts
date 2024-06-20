import {format as prettify} from 'prettier'
import {Options} from './index.js'

export async function format(code: string, options: Options): Promise<string> {
  if (!options.format) {
    return code
  }
  return prettify(code, {parser: 'typescript', ...options.style})
}
