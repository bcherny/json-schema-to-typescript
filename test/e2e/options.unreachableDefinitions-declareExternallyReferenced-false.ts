export const input = {
  $defs: {
    CreateThingRequestBody: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
      },
    },
  },
}

export const options = {
  unreachableDefinitions: true,
  declareExternallyReferenced: false,
}
