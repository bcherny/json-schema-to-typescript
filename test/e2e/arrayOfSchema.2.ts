// @see https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/43bfc6b/test-schema.json
export const input = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'array',
  items: {
    type: 'object',
    required: ['description', 'schema', 'tests'],
    properties: {
      description: {type: 'string'},
      schema: {},
      tests: {
        type: 'array',
        items: {
          type: 'object',
          required: ['description', 'data', 'valid'],
          properties: {
            description: {type: 'string'},
            data: {},
            valid: {type: 'boolean'},
          },
          additionalProperties: false,
        },
        minItems: 1,
      },
    },
    additionalProperties: false,
    minItems: 1,
  },
}
