export const input = {
  title: 'additionalItems',
  type: 'object',
  properties: {
    array: {
      type: 'object',
      properties: {
        withMinItems: {
          type: 'array',
          items: {
            type: 'string'
          },
          minItems: 3,
        },
        withMaxItems: {
          type: 'array',
          items: {
            type: 'string'
          },
          maxItems: 3,
        },
        withMinMaxItems: {
          type: 'array',
          items: {
            type: 'string'
          },
          minItems: 3,
          maxItems: 8,
        },
      },
      additionalProperties: false
    },
    tuple: {
      type: 'object',
      properties: {
        withMinItemsLessThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          minItems: 2,
        },
        withMinItemsGreaterThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          minItems: 8,
        },
        withMaxItemsLessThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          maxItems: 2,
        },
        withMaxItemsGreaterThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          maxItems: 8,
        },
        withMinItemsLessThanItemLength_and_MaxItemsGreaterThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          minItems: 4,
          maxItems: 8,
        },
        withMinItemsLessThanItemLength_and_MaxItemsLessThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          minItems: 2,
          maxItems: 4,
        },
        withMinItemsGreaterThanItemLength_and_MaxItemsGreaterThanItemLength: {
          type: 'array',
          items: [
            { enum: [1] },
            { enum: [2] },
            { enum: [3] },
            { enum: [4] },
            { enum: [5] },
            { enum: [6] },
          ],
          minItems: 8,
          maxItems: 10,
        },
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
}
