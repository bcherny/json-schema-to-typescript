// https://github.com/bcherny/json-schema-to-typescript/issues/410
// A nullable enum that compiles to a TypeScript `enum` (explicit `tsEnumNames`, or
// inferred with `inferStringEnumKeysFromValues`) keeps its `enum` declaration and its
// name - from its title, else the property or definition it sits under - and the use
// site becomes `Name | null`. Expected = what master emits with each enum declared as a
// definition and referenced as `anyOf: [{$ref}, {type: 'null'}]`.
export const input = {
  title: 'NullableNamedEnum',
  type: 'object',
  definitions: {
    Level: {type: 'string', enum: ['low', 'high'], tsEnumNames: ['Low', 'High'], nullable: true},
  },
  properties: {
    status: {type: 'string', enum: ['active', 'gone'], nullable: true},
    letter: {title: 'Letter', type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B'], nullable: true},
    level: {$ref: '#/definitions/Level'},
  },
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
