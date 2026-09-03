/**
 * An object that is nothing but a map -- one index signature, no comment on it -- prints on one
 * line, `{[k: string]: T}`; one whose signature carries a comment, or whose line runs past the
 * print width, keeps the long form.
 */
export const input = {
  title: 'MapOnly',
  type: 'object',
  additionalProperties: false,
  properties: {
    labels: {type: 'object', additionalProperties: {type: 'string'}},
    nullableLabels: {
      anyOf: [{type: 'object', additionalProperties: {type: ['string', 'null']}}, {type: 'null'}],
    },
    open: {type: 'object'},
    listOfMaps: {type: 'array', items: {type: 'object', additionalProperties: {type: 'number'}}},
    described: {
      type: 'object',
      description: 'The comment belongs to the property, so the map still fits on one line',
      additionalProperties: {type: 'boolean'},
    },
    commentedSignature: {
      type: 'object',
      additionalProperties: {type: 'string', description: 'A comment on the signature keeps the long form'},
    },
    tooLongForOneLine: {
      type: 'object',
      additionalProperties: {
        anyOf: [
          {type: 'string'},
          {
            type: 'object',
            properties: {aPropertyWithAVeryLongName: {type: 'string'}, anotherPropertyWithALongName: {type: 'string'}},
          },
        ],
      },
    },
  },
}
