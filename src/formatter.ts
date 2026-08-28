import {format as prettify} from 'prettier'
import {Options} from './'

export async function format(code: string, options: Options): Promise<string> {
  if (!options.format) {
    return code
  }
  // A `.d.ts` filepath lets prettier skip JSX detection, a regex scan that is quadratic on large quote-free output
  return prettify(code, {parser: 'typescript', filepath: 'schema.d.ts', ...options.style})
}
