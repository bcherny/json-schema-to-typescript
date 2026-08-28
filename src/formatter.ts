import {format as prettify, Options as PrettierOptions} from 'prettier'
import {Options} from './'

/**
 * Output larger than this is handed to prettier a batch of top-level declarations at a time
 * instead of as one file. Prettier's time and memory grow faster than its input, and a top-level
 * declaration formats the same on its own as it does in the middle of a file, so the result is
 * the same text, sooner, with a fraction of the peak heap.
 */
const BATCH_SIZE = 250_000

/**
 * @param parts the generated file, split before each top-level declaration (see `generate`:
 * `parts.join('')` is the whole file)
 */
export async function format(parts: string[], options: Options, batchSize = BATCH_SIZE): Promise<string> {
  if (!options.format) {
    return parts.join('')
  }
  // A `.d.ts` filepath lets prettier skip JSX detection, a regex scan that is quadratic on large quote-free output
  const style: PrettierOptions = {parser: 'typescript', filepath: 'schema.d.ts', ...options.style}
  if (!canFormatInBatches(style)) {
    return prettify(parts.join(''), style)
  }

  const newline = style.endOfLine === 'crlf' ? '\r\n' : style.endOfLine === 'cr' ? '\r' : '\n'
  let formatted = ''
  let batch = ''
  for (const part of parts) {
    const gap = batch.length + part.length > batchSize ? newlinesBetween(batch, part) : 0
    if (gap > 0) {
      // prettier ends a file with one newline, and keeps one blank line between statements that had any
      formatted += (await prettify(batch, style)) + (gap > 1 ? newline : '')
      batch = ''
    }
    batch += part
  }
  return formatted + (await prettify(batch, style))
}

/**
 * Whether formatting the file in batches gives the same result as formatting it whole under
 * these options: not when they refer to positions in the file or to a pragma at its top, guess
 * the line ending from the whole text, or load plugins (which may do any of those).
 */
function canFormatInBatches(style: PrettierOptions): boolean {
  return (
    style.rangeStart === undefined &&
    style.rangeEnd === undefined &&
    !style.requirePragma &&
    !style.insertPragma &&
    !style.checkIgnorePragma &&
    style.endOfLine !== 'auto' &&
    !style.plugins?.length
  )
}

/**
 * The number of newlines that separate the code in `before` from the code in `after` if a batch
 * may end between the two, 0 if not. It may when nothing but newlines separates them and `before`
 * does not end with a comment (prettier reads a comment together with the statement after it;
 * `// prettier-ignore` for one): that leaves prettier nothing to interpret at the boundary but a
 * statement break, with a blank line or without.
 */
function newlinesBetween(before: string, after: string): number {
  let end = before.length
  while (end > 0 && before[end - 1] === '\n') end--
  let start = 0
  while (start < after.length && after[start] === '\n') start++
  if (end === 0 || start === after.length || /\s/.test(before[end - 1]) || /\s/.test(after[start])) {
    return 0
  }
  const lastLine = before.slice(before.lastIndexOf('\n', end - 1) + 1, end)
  if (lastLine.includes('//') || lastLine.includes('/*') || lastLine.endsWith('*/')) {
    return 0
  }
  return before.length - end + start
}
