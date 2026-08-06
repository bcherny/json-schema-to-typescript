import {format as prettify} from 'prettier'
import {Options} from './'

async function expandDefaultComments(code: string): Promise<string> {
  const pattern = /^(\s*\* )@default \[\[__PRETTIFY_DEFAULT_JSON__:(.+)\]\]$/gm
  let result = ''
  let lastIndex = 0

  for (const match of code.matchAll(pattern)) {
    const [fullMatch, prefix, encodedDefault] = match
    const index = match.index ?? 0
    result += code.slice(lastIndex, index)

    const formattedDefault = (
      await prettify(decodeURIComponent(encodedDefault), {
        parser: 'json5', // JSON5 lets Prettier print object keys without forcing strict JSON quoting.
        printWidth: 20,
        trailingComma: 'none',
        singleQuote: false,
      })
    ).trimEnd()

    const lines = formattedDefault.split('\n')
    result += `${prefix}@default ${lines[0]}`
    for (const line of lines.slice(1)) {
      result += `\n${prefix}${line}`
    }

    lastIndex = index + fullMatch.length
  }

  result += code.slice(lastIndex)
  return result
}

export async function format(code: string, options: Options): Promise<string> {
  const expandedDefaults = await expandDefaultComments(code)
  if (!options.format) {
    return expandedDefaults
  }
  return prettify(expandedDefaults, {parser: 'typescript', ...options.style})
}
