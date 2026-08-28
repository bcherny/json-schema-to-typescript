/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/613
 * Since draft 2019-09 a `$ref` no longer replaces its siblings: `person` below
 * is BaseType *and* has an `age` property. The dereferencer used to merge the
 * $ref target and the siblings shallowly, so the sibling `properties` ({age})
 * shadowed BaseType's `properties` ({name}) and `name` silently disappeared
 * from Person. The reference and its siblings are now composed like the
 * equivalent `allOf` (`type Person = BaseType & {age?: number}`); ref.7.ts is
 * the reporter's full schema, with `unevaluatedProperties: false` closing the
 * added properties. Either that or `interface Person extends BaseType` meets
 * the bar: `name` must not be dropped.
 */
export const input = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Sample',
  type: 'object',
  additionalProperties: false,
  properties: {
    neighborhood: {
      type: 'array',
      items: {$ref: '#/$defs/person'},
    },
  },
  $defs: {
    baseType: {
      title: 'BaseType',
      type: 'object',
      properties: {name: {type: 'string'}},
    },
    person: {
      title: 'Person',
      $ref: '#/$defs/baseType',
      type: 'object',
      properties: {age: {type: 'number'}},
    },
  },
}
