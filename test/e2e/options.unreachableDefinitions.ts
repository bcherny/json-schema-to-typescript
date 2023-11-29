export const input = {
  title: 'UnreachableDefinition',
  type: 'object',
  definitions: {
    a: {
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          id: 'lastName',
          type: 'string',
        },
      },
    },
  },
  properties: {
    b: {
      properties: {
        likesDogs: {
          type: 'boolean',
        },
      },
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}
