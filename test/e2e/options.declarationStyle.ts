/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 * https://github.com/bcherny/json-schema-to-typescript/issues/653
 *
 * `declarationStyle: 'type'` prints object schemas as `export type X = {...}` instead of
 * `export interface X {...}`. Comments (schema and property level, `deprecated`) stay where
 * they were; enums, unions, tuples and named non-object aliases are untouched.
 */
import {Options} from '../../src'

export const input = {
  title: 'Person',
  description: 'A person. With `declarationStyle: type` this is a type alias, not an interface.',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
    },
    age: {
      description: 'Age in years.',
      type: 'integer',
      minimum: 0,
    },
    hairColor: {
      description: 'A union of literals: unchanged.',
      enum: ['black', 'brown', 'blue'],
    },
    shirtSize: {
      description: 'A TypeScript enum: unchanged.',
      title: 'ShirtSize',
      enum: ['S', 'M', 'L'],
      tsEnumNames: ['Small', 'Medium', 'Large'],
    },
    id: {
      $ref: '#/definitions/id',
    },
    address: {
      $ref: '#/definitions/address',
    },
    previousAddresses: {
      description: 'A tuple type (minItems): unchanged.',
      type: 'array',
      items: {
        $ref: '#/definitions/address',
      },
      minItems: 1,
    },
    employer: {
      description: 'An anonymous nested object stays inline.',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
    nickname: {
      description: 'Use `firstName` instead.',
      deprecated: true,
      type: 'string',
    },
  },
  required: ['firstName', 'id'],
  additionalProperties: false,
  definitions: {
    id: {
      title: 'Id',
      description: 'A named non-object schema was already a type alias.',
      type: 'string',
    },
    address: {
      title: 'Address',
      description: 'A named nested object: its own type alias.',
      deprecated: true,
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        city: {
          type: 'string',
          description: 'City or town.',
        },
      },
      required: ['city'],
    },
  },
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
}
