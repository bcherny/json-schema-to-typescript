// @see https://github.com/bcherny/json-schema-to-typescript/issues/613
export const input = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Sample',
  type: 'object',
  additionalProperties: false,
  properties: {
    neighborhood: {
      type: 'array',
      items: {
        $ref: '#/$defs/person',
      },
    },
  },
  $defs: {
    baseType: {
      title: 'BaseType',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    person: {
      title: 'Person',
      $ref: '#/$defs/baseType',
      type: 'object',
      unevaluatedProperties: false,
      properties: {
        age: {
          type: 'number',
        },
      },
    },
  },
}
