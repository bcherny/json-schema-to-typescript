export const input = {
  type: 'object',
  properties: {
    result: {
      type: 'object',
      properties: {
        total: {
          type: 'integer',
          description: 'total num',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              enumType: {
                type: 'integer',
                description: 'duplicate enum',
                enum: [1, 2, 3, 5, 1, 2, 6, 10, 1, 1, 2, 1, 2],
              },
              objectType: {
                type: 'object',
                properties: {
                  minAmount: {
                    type: 'integer',
                    description: 'minimum amount',
                  },
                  maxAmount: {
                    type: 'integer',
                    description: 'maximum amount',
                  },
                },
                description: 'Object Propertie of ArrayObjectItem',
                additionalProperties: false,
              },
              env: {
                type: 'integer',
                description: 'env',
              },
              version: {
                type: 'string',
                description: 'version',
              },
            },
            additionalProperties: false,
          },
          description: 'data set',
        },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-04/schema#',
  additionalProperties: false,
}
