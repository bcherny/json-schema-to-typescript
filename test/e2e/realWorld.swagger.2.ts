/**
 * Tests that $ref as key works as expected
 */
export const input = {
  type: 'object',
  properties: {
    definitions: {
      $ref: '#/definitions/definitions',
    },
  },
  definitions: {
    definitions: {
      $ref: '#/definitions/schema',
    },
    schema: {
      type: 'object',
      properties: {
        additionalProperties: {
          anyOf: [
            {
              $ref: '#/definitions/schema',
            },
          ],
        },
      },
    },
  },
}
