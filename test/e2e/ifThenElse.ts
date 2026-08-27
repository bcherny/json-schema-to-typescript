/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/626
 * Same input and file name as PR #739's test. `traverse()` in src/utils.ts has
 * no case for `if` / `then` / `else`, so they fall through to the "definitions
 * can be on any key" catch-all, which treats their value as a *map* of
 * subschemas and runs every validator rule against `if.properties` itself.
 * A property named `deprecated` inside the conditional then trips
 * "deprecated must be a boolean" (the shape OpenAPI 3.1's own schema uses).
 * On master this case throws a ValidationError instead of compiling.
 */
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
