export const input = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'John Doe',
    },
    age: {
      type: 'number',
      default: 0,
    },
    email: {
      type: ['string', 'null'],
      default: null,
    },
    attributes: {
      type: 'object',
      properties: {},
      default: {},
    },
    isActive: {
      type: 'boolean',
    },
  },
}

export const options = {
  removeOptionalIfDefaultExists: true,
}
