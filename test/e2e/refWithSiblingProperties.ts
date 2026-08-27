/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/613
 * Since draft 2019-09 a `$ref` no longer replaces its siblings: `person` below
 * is BaseType *and* has an `age` property. On master the dereferencer merges
 * the $ref target and the siblings shallowly, so the sibling `properties`
 * ({age}) shadows BaseType's `properties` ({name}) and `name` silently
 * disappears from Person. The snapshot entry for this case holds what master
 * already emits for the same schema written with the non-standard `extends`
 * keyword (`interface Person extends BaseType`), which is the output the
 * reporter asked for; `type Person = BaseType & {age?: number}` (what an
 * explicit allOf gives today) would be the other acceptable shape. Either
 * way the bar is: `name` must not be dropped.
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
