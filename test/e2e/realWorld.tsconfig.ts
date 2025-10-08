// Minimal real-world test case extracted from TypeScript's tsconfig.json schema
// Demonstrates property duplication bug where compilerOptions.types appears twice
// in the generated CompilerOptions type due to allOf with overlapping definitions
export const input = {
  allOf: [
    {
      $ref: '#/definitions/compilerOptionsDefinition',
    },
    {
      $ref: '#/definitions/tsNodeDefinition',
    },
  ],
  definitions: {
    compilerOptionsDefinition: {
      properties: {
        compilerOptions: {
          type: ['object', 'null'],
          properties: {
            types: {
              type: ['array', 'null'],
              items: {
                type: ['string', 'null'],
              },
            },
            target: {
              type: ['string', 'null'],
            },
          },
        },
      },
    },
    tsNodeDefinition: {
      properties: {
        'ts-node': {
          type: ['object', 'null'],
          properties: {
            compilerOptions: {
              type: ['object', 'null'],
              allOf: [
                {
                  $ref: '#/definitions/compilerOptionsDefinition/properties/compilerOptions',
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
