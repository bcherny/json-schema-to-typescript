export const input = {
  type: 'object',
  properties: {
    a: {type: 'string'},
    b: {type: 'string'},
    c: {type: 'string'},
  },
  allOf: [
    {required: ['a']},
    {
      oneOf: [
        {required: ['b']},
        // Non-existent property is invalid, but it's not up to JSTT to validate this
        // "An object instance is valid against this keyword if every
        // item in the array is the name of a property in the instance."
        // @see https://json-schema.org/draft/2020-12/json-schema-validation#name-required
        {required: ['d']},
      ],
    },
  ],
}
