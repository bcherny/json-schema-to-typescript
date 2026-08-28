/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 *
 * Type aliases for object types may refer to themselves, so recursive schemas still work with
 * `declarationStyle: 'type'`: directly (`parent`), through an array (`children`), through
 * another named type (`Meta.owner`) and through an index signature (`Meta`'s
 * additionalProperties).
 */
import {Options} from '../../src'

export const input = {
  title: 'Tree',
  type: 'object',
  properties: {
    value: {
      type: 'string',
    },
    parent: {
      $ref: '#',
    },
    children: {
      type: 'array',
      items: {
        $ref: '#',
      },
    },
    meta: {
      $ref: '#/definitions/meta',
    },
  },
  required: ['value', 'children'],
  additionalProperties: false,
  definitions: {
    meta: {
      title: 'Meta',
      type: 'object',
      properties: {
        owner: {
          $ref: '#',
        },
        nested: {
          $ref: '#/definitions/meta',
        },
      },
      additionalProperties: {
        $ref: '#',
      },
    },
  },
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
}
