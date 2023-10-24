export const input = {
  additionalProperties: false,
  definitions: {
    location: {
      properties: {
        city: {type: 'string'},
        postalCode: {type: 'number'},
      },
    },
  },
  properties: {
    location: {
      allOf: [{$ref: '#/definitions/location'}, {required: ['postalCode']}],
    },
    name: {type: 'string'},
    website: {type: 'string'},
  },
  required: ['name', 'location'],
  type: 'object',
}
