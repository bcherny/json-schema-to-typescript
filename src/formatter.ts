import {Options} from './'

export function format(code: string, options: Options): string {
  if (!options.format) {
    return code
  }
  return require('prettier').format(code, {parser: 'typescript', ...options.style})
}
