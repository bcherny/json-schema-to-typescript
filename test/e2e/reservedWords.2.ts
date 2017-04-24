export const input = {
  type: 'object',
  properties: {
    definitions: {
      $ref: '#/definitions/definitions'
    }
  },
  definitions: {
    definitions: {
      $ref: '#/definitions/schema'
    },
    schema: {
      type: 'object',
      properties: {
        additionalProperties: {
          anyOf: [
            {
              $ref: '#/definitions/schema'
            }
          ]
        }
      }
    }
  }
}

export const output = `export interface ReservedWords {
  definitions?: Definitions;
  [k: string]: any;
}
export interface Definitions {
  additionalProperties?: Definitions;
  [k: string]: any;
}
`
