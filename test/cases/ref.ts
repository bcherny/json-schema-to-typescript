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
          enum: [16, 18, 22],
          tsEnumNames: ['SMALL', 'MEDIUM', 'LARGE'],
          type: 'number'
        }
      },
      required: ['size']
    }
  },
  properties: {
    color: {
      $ref: '#/definitions/color'
    },
    interior: {
      properties: {
        color: {
          $ref: '#/definitions/color'
        },
        material: {
          $ref: '#/definitions/material'
        },
        panelColor: {
          $ref: '#/properties/interior/properties/color'
        }
      },
      required: ['color']
    },
    tire: {
      $ref: '#/definitions/tire'
    }
  },
  required: ['color', 'interior', 'tire'],
  title: 'Car',
  type: 'object'
}

export const types = `export type Color = "blue" | "green" | "red";
export type Material = "leather" | "suede";
export const enum Size {
  SMALL = 16,
  MEDIUM = 18,
  LARGE = 22
};
export interface Tire {
  size: Size;
}
export interface Car {
  color: Color;
  interior: {
    color: Color;
    material?: Material;
    panelColor?: Color;
    [k: string]: any;
  };
  tire: Tire;
}`
