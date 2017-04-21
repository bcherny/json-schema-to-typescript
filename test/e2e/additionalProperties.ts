export const input = {
  title: 'AdditionalProperties',
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  },
  additionalProperties: {
    type: 'number'
  }
}

export const output = `export interface AdditionalProperties {
  foo?: string;
  [k: string]: number;
}
`
