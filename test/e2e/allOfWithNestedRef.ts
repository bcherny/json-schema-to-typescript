// Tests allOf with nested $ref that creates redundant intersections
// Pattern: Schema A defines property X, Schema B references A and also defines X with allOf
// This creates A & (A | null) which should simplify to A | null
export const input = {
  allOf: [
    {
      $ref: '#/definitions/baseDefinition',
    },
    {
      $ref: '#/definitions/extendedDefinition',
    },
  ],
  definitions: {
    baseDefinition: {
      properties: {
        sharedProperty: {
          type: ['object', 'null'],
          properties: {
            foo: {
              type: ['array', 'null'],
              items: {
                type: ['string', 'null'],
              },
            },
            bar: {
              type: ['string', 'null'],
            },
          },
        },
      },
    },
    extendedDefinition: {
      properties: {
        extendedProperty: {
          type: ['object', 'null'],
          properties: {
            sharedProperty: {
              type: ['object', 'null'],
              allOf: [
                {
                  $ref: '#/definitions/baseDefinition/properties/sharedProperty',
                },
              ],
              properties: {},
            },
          },
        },
      },
    },
  },
}
