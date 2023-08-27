export const input = {
  $schema: 'https://json-schema.org/draft/2019-09/schema',
  type: 'object',
  title: 'EntityObjectDefinition',
  properties: {
    definitions: {
      type: 'object',
      additionalProperties: false,
      minProperties: 1,
      patternProperties: {
        '^[a-zA-Z0-9_. /]+$': {
          type: 'object',
          $ref: '#/definitions/EntityObject',
        },
      },
    },
  },
  definitions: {
    EntityObject: {
      type: 'object',
      description: 'My example entity object definition',
      required: ['EntityDataCategory'],
      properties: {
        EntityDataCategory: {
          type: 'object',
          additionalProperties: false,
          properties: {
            APorpertyName: {
              $ref: '#/definitions/EntityDataCategory',
            },
          },
        },
      },
    },
    EntityDataCategory: {
      type: 'string',
      enum: ['TABLE', 'OBJ', 'FUNC'],
      tsEnumNames: ['Table', 'Field', 'Func'],
    },
  },
}
