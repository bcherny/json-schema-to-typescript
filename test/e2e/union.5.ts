export const input = {
  $defs: {
    person: {
      type: ['object', 'string'],
      properties: {
        name: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
  },
  properties: {
    user: {$ref: '#/$defs/person'},
  },
  additionalProperties: false,
}

export const only = true
