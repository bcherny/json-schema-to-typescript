export const input = {
  definitions: {
    definitions: {
      type: 'integer'
    },
    properties: {
      type: 'string'
    }
  },
  properties: {
    additionalProperties: {
      items: {
        type: 'number'
      },
      type: 'array'
    },
    definitions: {
      type: 'number'
    },
    properties: {
      type: 'boolean'
    }
  },
  type: 'object'
}

export const output = `export interface ReservedWords {
  additionalProperties?: number[];
  definitions?: number;
  properties?: boolean;
  [k: string]: any;
}
`
