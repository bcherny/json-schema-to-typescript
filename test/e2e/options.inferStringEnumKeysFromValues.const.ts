export const input = {
  title: 'InferStringEnumKeysFromValuesConst',
  type: 'object',
  properties: {
    // A singleton `const` is normalized into a singleton `enum` internally, but it
    // should still emit as a plain string literal type, not a named `const enum`.
    constString: {
      type: 'string',
      const: 'foo',
    },
  },
  required: ['constString'],
  additionalProperties: false,
}

export const options = {
  inferStringEnumKeysFromValues: true,
}
