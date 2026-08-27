/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/525
 * `declareExternallyReferenced: false` is only honoured for named interfaces;
 * externally referenced type aliases (a scalar, a union) are still declared in
 * the output. Same input, file name and resource as PR #734's test; the
 * snapshot entry holds the expected output (only the referencing alias), so
 * this fails on master, which also emits `ExampleScalarSchema` and
 * `ExampleCombinedSchema`.
 */
export const input = {
  title: 'Referencing Non Interface',
  anyOf: [
    {
      $ref: 'test/resources/ReferencedScalarType.json',
    },
    {
      $ref: 'test/resources/ReferencedCombinationType.json',
    },
  ],
}

export const options = {
  declareExternallyReferenced: false,
}
