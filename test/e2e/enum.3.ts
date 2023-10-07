// Reported in #327
export const input = {
  title: 'InterfaceWithTsEnumNames',
  anyOf: [{$ref: '#/definitions/InterfaceWithTsEnumNames'}],
  definitions: {
    InterfaceWithTsEnumNames: {
      type: 'object',
      properties: {
        TsEnumNames: {$ref: '#/definitions/TsEnums'},
      },
      additionalProperties: false,
    },
    TsEnums: {
      type: 'string',
      tsEnumNames: ['publish', 'draft'],
      enum: ['publish', 'draft'],
    },
  },
}
