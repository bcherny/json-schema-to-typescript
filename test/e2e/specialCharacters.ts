export const input = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    '`foo`': {
      type: 'string'
    },
    "'bar'": {
      type: 'string'
    },
    '"baz"': {
      type: 'string'
    },
    '$zoo 2': {
      type: 'string'
    },
    'qux...': {
      type: 'number'
    }
  },
  required: ['`foo`', '\'bar\'', '\"baz\"']
}

export const output = `export interface ExampleSchema {
  "\`foo\`": string;
  "'bar'": string;
  "\\\"baz\\\"": string;
  "$zoo 2"?: string;
  "qux..."?: number;
  [k: string]: any;
}
`
