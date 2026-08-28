// https://github.com/bcherny/json-schema-to-typescript/issues/183
// A `formatTypes` entry that isn't type text (eg. a CLI flag given no value,
// `--formatTypes.date-time`, which parses as `true`) is an error, not `at?: true`
export const input = {
  title: 'Event',
  type: 'object',
  properties: {
    at: {type: 'string', format: 'date-time'},
  },
}

export const options = {
  formatTypes: {
    'date-time': true,
  },
}

export const error = true
