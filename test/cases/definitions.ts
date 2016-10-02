import { JSONSchema } from '../../src/JSONSchema'

export const schema: JSONSchema = {
  additionalProperties: false,
  definitions: {
    color: {
      enum: ['blue', 'green', 'red'],
      type: 'string'
    },
    material: {
      enum: ['leather', 'suede'],
      type: 'string'
    },
    tire: {
      additionalProperties: false,
      properties: {
        size: {
          enum: [16, 17, 18, 19, 20, 21, 22],
          type: 'number'
        }
      },
      required: ['size']
    }
  },
  title: 'Car',
  type: 'object'
}

export const types = `export type Car = Object;`
