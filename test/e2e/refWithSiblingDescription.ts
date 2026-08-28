/** @see https://github.com/bcherny/json-schema-to-typescript/issues/193 */
export const input = {
  title: 'Offer',
  description: 'An offer',
  type: 'object',
  properties: {
    price: {
      description: 'Price excl. VAT',
      $ref: '#/definitions/Price',
    },
    priceInclVAT: {
      description: 'Price incl. VAT',
      $ref: '#/definitions/Price',
    },
  },
  definitions: {
    Price: {
      title: 'Price',
      description: 'A price',
      type: 'object',
      properties: {
        value: {
          description: 'Price as number',
          type: 'number',
        },
        text: {
          description: 'Price as string',
          type: 'string',
        },
      },
    },
  },
}
