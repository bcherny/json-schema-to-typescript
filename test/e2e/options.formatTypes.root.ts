// https://github.com/bcherny/json-schema-to-typescript/issues/183
// A root schema that is itself a formatted string
export const input = {
  title: 'Timestamp',
  type: 'string',
  format: 'date-time',
}

export const options = {
  formatTypes: {
    'date-time': 'Date',
  },
}
