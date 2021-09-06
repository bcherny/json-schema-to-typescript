// Reported in #327
export const input = {
  title: 'InterfaceWithEnumNames',
  anyOf: [{$ref: '#/definitions/InterfaceWithEnumNames'}],
  definitions: {
    InterfaceWithEnumNames: {
      type: 'object',
      properties: {
        EnumNames: {$ref: '#/definitions/Enums'}
      },
      additionalProperties: false
    },
    Enums: {
      type: 'string',
      'x-enum-varnames': ['publish', 'draft'],
      enum: ['publish', 'draft']
    }
  }
}
