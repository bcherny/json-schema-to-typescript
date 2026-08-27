/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/525
 * Control for ref.8b: with `declareExternallyReferenced: true` (the default)
 * the referenced scalar and union aliases are declared. Passes on master; same
 * file as PR #734's.
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
  declareExternallyReferenced: true,
}
