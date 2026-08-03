export const input = {
  $schema: 'http://json-schema.org/schema#',
  definitions: {
    status_block: {
      type: 'object',
      properties: {
        experimental: {type: 'boolean', description: 'exp'},
        standard_track: {type: 'boolean', description: 'std'},
        deprecated: {type: 'boolean', description: 'dep'},
      },
      required: ['experimental', 'standard_track', 'deprecated'],
      additionalProperties: false,
    },
    compat_statement: {
      type: 'object',
      properties: {
        status: {
          $ref: '#/definitions/status_block',
          description: 'An object containing information about the stability of the feature.',
          tsType: 'StatusBlock',
        },
      },
    },
  },
  title: 'CompatDataFile',
  type: 'object',
  patternProperties: {
    '^__compat$': {$ref: '#/definitions/compat_statement'},
  },
}

export const options = {
  unreachableDefinitions: true,
  $refOptions: {resolve: {file: false, http: false}},
}
