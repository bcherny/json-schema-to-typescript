export const input = {
  additionalProperties: false,
  definitions: {
    location: {
      properties: {
        city: {type: 'string', readOnly: true},
        postalCode: {type: 'number'}
      }
    }
  },
  properties: {
    location: {
      allOf: [{$ref: '#/definitions/location'}, {required: ['postalCode']}],
      readOnly: true
    },
    name: {type: 'string', readOnly: true},
    website: {type: 'string', readOnly: false}
  },
  required: ['name', 'location'],
  type: 'object'
}
