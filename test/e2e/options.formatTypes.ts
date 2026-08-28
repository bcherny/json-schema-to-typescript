// https://github.com/bcherny/json-schema-to-typescript/issues/183
// `formatTypes` maps a string schema's `format` to TypeScript type text. It applies
// wherever the schema resolves to a string (properties, array and tuple items,
// `additionalProperties`, `anyOf` members, nullable unions, `$ref`'d definitions,
// a string inferred from `default`); `tsType`, `enum` and `const` take precedence;
// formats that aren't listed, and `format` on a schema that isn't a string, are
// left alone.
export const input = {
  title: 'FormatTypes',
  type: 'object',
  definitions: {
    timestamp: {
      title: 'Timestamp',
      description: 'A definition keeps its name; only what it aliases changes',
      type: 'string',
      format: 'date-time',
    },
  },
  properties: {
    createdAt: {
      description: 'RFC 3339 date-time',
      type: 'string',
      format: 'date-time',
    },
    birthday: {
      type: 'string',
      format: 'date',
    },
    website: {
      type: 'string',
      format: 'uri',
    },
    id: {
      type: 'string',
      format: 'uuid',
    },
    unmappedFormat: {
      type: 'string',
      format: 'email',
    },
    inferredFromDefault: {
      format: 'date-time',
      default: '2018-11-13T20:20:39+00:00',
    },
    formatWithoutStringType: {
      format: 'date-time',
    },
    formatOnNumber: {
      type: 'number',
      format: 'date-time',
    },
    nullable: {
      type: ['string', 'null'],
      format: 'date-time',
    },
    array: {
      type: 'array',
      items: {
        type: 'string',
        format: 'date-time',
      },
    },
    tuple: {
      type: 'array',
      minItems: 2,
      items: [
        {type: 'string', format: 'date'},
        {type: 'string', format: 'uuid'},
      ],
    },
    viaRef: {
      $ref: '#/definitions/timestamp',
    },
    anyOfMember: {
      anyOf: [{type: 'string', format: 'date-time'}, {type: 'number'}],
    },
    additional: {
      type: 'object',
      additionalProperties: {
        type: 'string',
        format: 'uri',
      },
    },
    tsTypeWins: {
      type: 'string',
      format: 'date-time',
      tsType: 'number',
    },
    enumWins: {
      type: 'string',
      format: 'date-time',
      enum: ['2018-11-13T20:20:39+00:00', '2019-11-13T20:20:39+00:00'],
    },
    constWins: {
      type: 'string',
      format: 'date-time',
      const: '2018-11-13T20:20:39+00:00',
    },
  },
  required: ['createdAt', 'id'],
  additionalProperties: false,
}

export const options = {
  formatTypes: {
    'date-time': 'Date',
    date: 'Date',
    uri: 'URL',
    // Any type expression works: it is emitted verbatim, like `tsType`
    uuid: '`${string}-${string}-${string}-${string}-${string}`',
  },
}
