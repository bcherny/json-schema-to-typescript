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
