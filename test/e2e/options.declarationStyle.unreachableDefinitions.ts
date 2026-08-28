/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 *
 * `unreachableDefinitions` declares definitions nothing refers to; with
 * `declarationStyle: 'type'` the object ones are type aliases too.
 */
import {Options} from '../../src'

export const input = {
  title: 'Root',
  type: 'object',
  properties: {
    used: {
      $ref: '#/definitions/used',
    },
  },
  additionalProperties: false,
  definitions: {
    used: {
      title: 'Used',
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
      },
    },
    unused: {
      description: 'Only reachable through unreachableDefinitions.',
      type: 'object',
      properties: {
        b: {
          $ref: '#/definitions/unusedLeaf',
        },
      },
      additionalProperties: false,
    },
    unusedLeaf: {
      type: 'number',
    },
  },
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
  unreachableDefinitions: true,
}
