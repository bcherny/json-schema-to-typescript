/**
 * https://github.com/bcherny/json-schema-to-typescript/issues/307
 *
 * `declareExternallyReferenced: false` behaves as it does for interfaces: the supertypes and
 * referenced types are named but not declared, so the intersection refers to `Base1`/`Base2`
 * that the caller declares elsewhere (compare extends.2b).
 */
import {Options} from '../../src'

export const input = {
  title: 'Extends',
  type: 'object',
  extends: [
    {
      $ref: 'test/resources/BaseType.1.json',
    },
    {
      $ref: 'test/resources/BaseType.2.json',
    },
  ],
  properties: {
    foo: {
      $ref: 'test/resources/ReferencedType.json',
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

export const options: Partial<Options> = {
  declarationStyle: 'type',
  declareExternallyReferenced: false,
}
