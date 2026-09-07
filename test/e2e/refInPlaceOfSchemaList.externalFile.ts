/**
 * A `$ref` standing in for a whole `allOf`, `anyOf`, `oneOf` or `prefixItems` list, leading to
 * a file that is an array of schemas, or to such an array inside a file. The compiler used to
 * crash (`TypeError: arr.forEach is not a function`) walking the document before dereferencing.
 */
export const input = {
  title: 'RefInPlaceOfSchemaList',
  type: 'object',
  properties: {
    record: {type: 'object', allOf: {$ref: 'SchemaLists/ObjectSchemas.json'}},
    value: {anyOf: {$ref: 'SchemaLists/lists.json#/scalars'}},
    kind: {oneOf: {$ref: 'SchemaLists/lists.json#/kinds'}},
    pair: {type: 'array', prefixItems: {$ref: 'SchemaLists/lists.json#/pair'}},
  },
  required: ['record', 'value', 'kind', 'pair'],
  additionalProperties: false,
}

export const options = {
  cwd: 'test/resources/',
}
