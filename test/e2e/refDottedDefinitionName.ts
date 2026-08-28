export const input = {
  definitions: {
    'v1.ManagedFieldsEntry': {type: 'object', properties: {manager: {type: 'string'}}},
  },
  type: 'object',
  properties: {
    entry: {$ref: '#/definitions/v1.ManagedFieldsEntry'},
  },
}

export const options = {
  declareExternallyReferenced: true,
}
