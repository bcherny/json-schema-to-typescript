/**
 * A description's line breaks become comment lines whichever way they were written: `\n`, `\r\n`
 * (a schema edited on Windows) or a lone `\r`. A line the comment did not prefix with ` * ` would
 * otherwise make the formatter print the whole comment verbatim, out of column.
 */
export const input = {
  title: 'LineBreaks',
  type: 'object',
  additionalProperties: false,
  properties: {
    lf: {type: 'string', description: 'first line\nsecond line'},
    crlf: {type: 'string', description: 'first line\r\nsecond line'},
    cr: {type: 'string', description: 'first line\rsecond line'},
    mixed: {
      type: 'string',
      description: 'paragraph one\r\rparagraph two, line one\r\nline two\nline three',
    },
  },
}
