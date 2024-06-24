// From https://github.com/bcherny/json-schema-to-typescript/issues/597
export const input = {
  oneOf: [{$ref: '#/definitions/Car'}, {$ref: '#/definitions/Truck'}],
  definitions: {
    Thing: {
      type: 'object',
      properties: {
        name: {type: 'string'},
      },
      required: ['name'],
    },
    Vehicle: {
      type: 'object',
      allOf: [{$ref: '#/definitions/Thing'}],
      properties: {
        year: {type: 'integer'},
      },
      required: ['year'],
    },
    Car: {
      type: 'object',
      allOf: [{$ref: '#/definitions/Vehicle'}],
      properties: {
        numDoors: {type: 'integer'},
      },
      required: ['numDoors'],
    },
    Truck: {
      type: 'object',
      allOf: [{$ref: '#/definitions/Vehicle'}],
      properties: {
        numAxles: {type: 'integer'},
      },
      required: ['numAxles'],
    },
  },
}
