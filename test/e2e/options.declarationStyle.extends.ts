/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 *
 * With `declarationStyle: 'type'`, `extends` (an interface's `extends A, B` clause) is printed
 * as an intersection: `export type X = A & B & {...}`. Covers a chain of two (Square -> Rectangle
 * -> Shape) and multiple supertypes (LabelledSquare -> Rectangle, Labelled).
 */
import {Options} from '../../src'

export const input = {
  title: 'Drawing',
  type: 'object',
  properties: {
    square: {
      $ref: '#/definitions/square',
    },
    labelledSquare: {
      $ref: '#/definitions/labelledSquare',
    },
  },
  additionalProperties: false,
  definitions: {
    shape: {
      title: 'Shape',
      description: 'The root of the chain.',
      type: 'object',
      properties: {
        kind: {
          type: 'string',
        },
      },
      required: ['kind'],
      additionalProperties: false,
    },
    rectangle: {
      title: 'Rectangle',
      description: 'Extends one supertype.',
      type: 'object',
      extends: {
        $ref: '#/definitions/shape',
      },
      properties: {
        width: {
          type: 'number',
        },
        height: {
          type: 'number',
        },
      },
      required: ['width', 'height'],
      additionalProperties: false,
    },
    square: {
      title: 'Square',
      description: 'Second link of the chain: Square -> Rectangle -> Shape.',
      type: 'object',
      extends: {
        $ref: '#/definitions/rectangle',
      },
      properties: {
        side: {
          type: 'number',
        },
      },
      required: ['side'],
      additionalProperties: false,
    },
    labelled: {
      title: 'Labelled',
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'Shown next to the shape.',
        },
      },
    },
    labelledSquare: {
      title: 'LabelledSquare',
      description: 'Multiple supertypes.',
      type: 'object',
      extends: [
        {
          $ref: '#/definitions/rectangle',
        },
        {
          $ref: '#/definitions/labelled',
        },
      ],
      properties: {
        side: {
          type: 'number',
        },
      },
      required: ['side'],
      additionalProperties: false,
    },
  },
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
}
