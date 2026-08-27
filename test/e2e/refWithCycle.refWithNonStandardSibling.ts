/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/482
 * Companion to refWithCycle.refWithDescription.ts: the schema the issue links
 * (schemastore circleciconfig.json, today a stub whose `$ref` resolves to
 * CircleCI's language-server schema) reaches its self-referencing definition
 * through a `$ref` whose only sibling is the non-standard `markdownDescription`
 * (`definitions.logic.oneOf[1].properties.not`). Any sibling key, annotation or
 * not, makes the ref parser substitute an unnamed copy whose `properties.not`
 * is itself, so master throws `RangeError: Maximum call stack size exceeded`;
 * a fix that only special-cases draft annotation keywords still throws here.
 */
export const input = {
  definitions: {
    logical: {
      type: 'object',
      properties: {
        not: {
          $ref: '#/definitions/logical',
          markdownDescription: 'Logical not: true when statement is false',
        },
      },
    },
  },
  properties: {
    when: {
      $ref: '#/definitions/logical',
    },
  },
  type: 'object',
}
