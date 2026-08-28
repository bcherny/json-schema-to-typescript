// https://github.com/bcherny/json-schema-to-typescript/issues/626
// `deprecated` used as a property name inside `if`/`then`/`else` conditionals
// used to trip the `deprecated must be a boolean` validator rule, because the
// traversal treated the conditional keyword values as maps of subschemas and
// visited their `properties` container as if it were a schema itself.
export const input = {
  title: 'IfThenElse',
  type: 'object',
  properties: {
    deprecated: {
      type: 'boolean',
    },
    deprecationNotice: {
      type: 'string',
    },
  },
  if: {
    properties: {
      deprecated: {
        const: true,
      },
    },
    required: ['deprecated'],
  },
  then: {
    properties: {
      deprecated: {
        const: true,
      },
    },
    required: ['deprecationNotice'],
  },
  else: {
    properties: {
      deprecated: {
        const: false,
      },
    },
    required: ['deprecationNotice'],
  },
}
