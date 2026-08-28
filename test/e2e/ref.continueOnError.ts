// With `continueOnError`, the ref parser collects what it cannot resolve instead of throwing on the
// first one: those collected errors still fail the compile (as one JSONParserErrorGroup naming the
// file), rather than leaving holes in the schema for a later stage to trip over
export const input = {
  title: 'ContinueOnError',
  type: 'object',
  properties: {
    missing: {$ref: 'test/resources/NoSuchFile.json'},
  },
}

export const options = {
  $refOptions: {continueOnError: true},
}

export const error = 'error occurred while reading'
