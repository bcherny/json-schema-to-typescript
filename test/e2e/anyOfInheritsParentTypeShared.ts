// https://github.com/bcherny/json-schema-to-typescript/issues/528
// The same member object can sit under several parents without a `$ref` (YAML anchors
// through the CLI, or a programmatic caller reusing one object). Each parent types its
// own copy of it, and the object itself - here also property `anything` - is untouched.
const loose = {description: 'free-form value'}

export const input = {
  type: 'object',
  properties: {
    host: {type: 'string', anyOf: [loose, {format: 'hostname'}]},
    count: {type: 'integer', anyOf: [loose, {minimum: 1}]},
    anything: loose,
  },
  additionalProperties: false,
}
