export const input = {
  title: 'UnionDeduplicationDisabled',
  type: 'object',
  properties: {
    union: {
      oneOf: [
        {
          type: 'string'
        },
        {
          type: 'string'
        }
      ]
    }
  }
}

export const options = {
  disableUnionDeduplication: true
}
