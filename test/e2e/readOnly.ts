// @see https://github.com/bcherny/json-schema-to-typescript/issues/131
// JSON Schema's `readOnly: true` annotation (draft 7+, also OpenAPI): the property gets
// TypeScript's `readonly` modifier, and an annotated array or tuple becomes `readonly T[]`.
export const input = {
  title: 'ReadOnly',
  type: 'object',
  definitions: {
    tags: {
      title: 'Tags',
      description: 'A named array type that is readOnly wherever it is used',
      type: 'array',
      items: {type: 'string'},
      readOnly: true,
    },
  },
  properties: {
    id: {type: 'string', format: 'uuid', readOnly: true, description: 'Assigned by the server'},
    name: {type: 'string', readOnly: false},
    age: {type: 'integer'},
    createdAt: {type: 'string', format: 'date-time', readOnly: true},
    address: {
      description: 'readOnly applies to this property; the members keep their own annotations',
      type: 'object',
      readOnly: true,
      properties: {
        street: {type: 'string'},
        postcode: {type: 'string', readOnly: true},
      },
      additionalProperties: false,
    },
    history: {
      description: 'A readOnly array: both the property and the array type are readonly',
      type: 'array',
      readOnly: true,
      items: {type: 'object', properties: {at: {type: 'string'}}},
    },
    aliases: {
      description: 'A writable property holding a writable array of readOnly arrays',
      type: 'array',
      items: {type: 'array', items: {type: 'string'}, readOnly: true},
    },
    coordinates: {
      type: 'array',
      readOnly: true,
      minItems: 2,
      items: [{type: 'number'}, {type: 'number'}],
    },
    boundedList: {
      type: 'array',
      readOnly: true,
      minItems: 1,
      maxItems: 3,
      items: {type: 'string'},
    },
    tags: {$ref: '#/definitions/tags'},
    external: {
      description: 'tsType supplies the type verbatim; the property is still readonly',
      tsType: 'Map<string, number>',
      readOnly: true,
    },
    arrayOrString: {
      type: ['array', 'string'],
      items: {type: 'number'},
      readOnly: true,
    },
    'kebab-key': {type: 'boolean', readOnly: true},
    nickname: {
      description: 'OpenAPI nullable keeps readOnly on the property',
      type: 'string',
      nullable: true,
      readOnly: true,
    },
    previousNames: {type: 'array', items: {type: 'string'}, nullable: true, readOnly: true},
  },
  patternProperties: {
    '^x-': {type: 'string', readOnly: true},
  },
  additionalProperties: {type: 'number', readOnly: true},
  required: ['id', 'name'],
}
