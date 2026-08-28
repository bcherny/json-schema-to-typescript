// A `default` implies a type (`'a'` -> string) only when the schema declares none. `allOf`
// declares one as much as `type`, `anyOf` or `oneOf` do: `{allOf: [{$ref}], default}` (how
// draft-07 generators such as pydantic v1 attach a default to a reference) is the referenced
// type, not `Level & string`.
export const input = {
  title: 'AllOfTakesPrecedenceOverDefault',
  type: 'object',
  additionalProperties: false,
  properties: {
    level: {allOf: [{$ref: '#/definitions/level'}], default: 'low'},
    named: {title: 'Verbosity', allOf: [{$ref: '#/definitions/level'}], default: 'high'},
    flag: {allOf: [{$ref: '#/definitions/flag'}], default: true},
    count: {allOf: [{$ref: '#/definitions/count'}], default: 3},
  },
  definitions: {
    level: {type: 'string', enum: ['low', 'high']},
    flag: {type: 'boolean'},
    count: {type: 'integer', minimum: 0},
  },
}
