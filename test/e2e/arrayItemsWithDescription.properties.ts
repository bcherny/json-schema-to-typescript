/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/660
 * Companion to arrayItemsWithDescription.ts: the same inline `items` description
 * on array-typed interface properties, and the shapes that are deliberately left
 * alone (named item types, nested arrays, positional tuples).
 */
export const input = {
  title: 'Trip',
  type: 'object',
  properties: {
    peoples: {
      type: 'array',
      description: 'Peoples desc',
      items: {type: 'string', description: 'Item desc'},
    },
    undescribedArray: {
      type: 'array',
      items: {type: 'string', description: 'Item desc only'},
    },
    atLeastOne: {
      type: 'array',
      description: 'minItems expands items into a tuple type',
      minItems: 1,
      items: {type: 'string', description: 'Item desc'},
    },
    multiLine: {
      type: 'array',
      items: {type: 'string', description: 'First line\nSecond line'},
    },
    inlineObjects: {
      type: 'array',
      items: {
        type: 'object',
        description: 'Anonymous object item',
        properties: {name: {type: 'string'}},
      },
    },
    namedItems: {
      type: 'array',
      description: 'Titled items become a standalone type that carries its own comment',
      items: {title: 'Person', type: 'string', description: 'Declared on Person, not here'},
    },
    nested: {
      type: 'array',
      description: 'Nested array items are not surfaced',
      items: {type: 'array', description: 'Row desc', items: {type: 'string', description: 'Cell desc'}},
    },
    positional: {
      type: 'array',
      description: 'Distinct positional descriptions are not surfaced',
      minItems: 2,
      items: [
        {type: 'number', description: 'Latitude'},
        {type: 'number', description: 'Longitude'},
      ],
    },
  },
  additionalProperties: false,
}
