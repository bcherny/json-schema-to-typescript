/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/56
 */
export const input = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Locally Referenced Manifest',
  type: 'object',
  definitions: {
    firstDefinition: {
      title: 'First Definition',
      description: 'Title matches definition key for kicks',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    secondDefinition: {
      title: 'Unrelated Title',
      description: 'Title is unrelated to definition key and behaviour is the same',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    thirdDefinition: {
      description: 'Definition has no title and produces no duplicate Interface',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
    fourthDefinition: {
      title: 'Fourth Definition Simple Object',
      description: 'A simple object type with title set and no properties defined produces no duplicate Interface',
      type: 'object',
    },
    fifthDefinition: {
      title: 'Fifth Definition String',
      description: 'A string with title and enum defined does produce a duplicate Interface',
      type: 'string',
      enum: ['one', 'two', 'three'],
    },
    sixthDefinition: {
      id: 'six',
      type: 'number',
    },
  },
  properties: {
    firstContainer: {
      description: 'Behaviour is the same if definition is referenced as prop within a container',
      type: 'object',
      properties: {
        first: {
          $ref: '#/definitions/firstDefinition',
        },
      },
    },
    second: {
      $ref: '#/definitions/secondDefinition',
    },
    third: {
      $ref: '#/definitions/thirdDefinition',
    },
    fourth: {
      $ref: '#/definitions/fourthDefinition',
    },
    fifth: {
      $ref: '#/definitions/fifthDefinition',
    },
    sixth: {
      $ref: '#/definitions/sixthDefinition',
    },
  },
}
