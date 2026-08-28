/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 *
 * Index signatures (additionalProperties, patternProperties) and `strictIndexSignatures` print
 * the same inside a type alias as inside an interface, including the widening that keeps named
 * properties assignable to the index signature.
 */
import {Options} from '../../src'

export const input = {
  title: 'Config',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    retries: {
      type: 'integer',
    },
    env: {
      title: 'Env',
      description: 'patternProperties only.',
      type: 'object',
      patternProperties: {
        '^[A-Z_]+$': {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
    labels: {
      description: 'Anonymous, additionalProperties only.',
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
  },
  required: ['name'],
  additionalProperties: {
    type: 'boolean',
  },
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
  strictIndexSignatures: true,
}
