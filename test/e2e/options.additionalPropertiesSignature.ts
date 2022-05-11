import {Options} from '../../src'

export const input = {
  title: 'Example Schema',
  type: 'object',
  definitions: {
    a: {
      properties: {
        x: {type: 'string'}
      }
    },
    b: {
      properties: {
        x: {type: 'string'}
      },
      additionalProperties: true
    },
    c: {
      properties: {
        x: {type: 'string'}
      },
      additionalProperties: false
    }
  },
  anyOf: [{$ref: '#/definitions/a'}, {$ref: '#/definitions/b'}, {$ref: '#/definitions/c'}]
}

export const options: Partial<Options> = {
  additionalPropertiesSignature: false
}
