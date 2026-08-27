/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/482
 * A definition that refers back to itself through a `$ref` carrying a sibling
 * `description` (schemastore's circleci `logical`, reduced in the issue thread).
 * The ref parser replaces the annotated `$ref` with a shallow merged copy that
 * has no standalone name and whose `properties.not` is itself, so the generator
 * inlines it forever: `RangeError: Maximum call stack size exceeded` on master.
 * Dropping the sibling `description`, or giving `logical` a `title`, avoids it.
 * Smallest trigger: `{definitions: {l: {type: 'object', properties: {not:
 * {$ref: '#/definitions/l', description: 'x'}}}}, properties: {when: {$ref:
 * '#/definitions/l'}}}`.
 */
export const input = {
  definitions: {
    logical: {
      oneOf: [
        {
          type: 'string',
          description: 'oneOf string',
        },
        {
          type: 'object',
          description: 'oneOf object',
          properties: {
            not: {
              description: 'THIS IS PROBLEMATIC',
              $ref: '#/definitions/logical',
            },
          },
        },
      ],
    },
  },
  properties: {
    workflows: {
      type: 'object',
      description: 'workflows object',
      properties: {
        when: {
          description: 'workflows when',
          $ref: '#/definitions/logical',
        },
      },
    },
  },
  type: 'object',
}
