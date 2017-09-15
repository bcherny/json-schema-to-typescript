import { format as prettify } from 'prettier'
import { DEFAULT_OPTIONS, Options } from './'

export function format(code: string, options: Options = DEFAULT_OPTIONS): string {
  return prettify(code, { parser: 'typescript', ...options.style })
}
