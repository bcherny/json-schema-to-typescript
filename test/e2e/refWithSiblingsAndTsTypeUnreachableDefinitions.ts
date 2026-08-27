/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/466
 * A `$ref` with sibling `description` + `tsType` under `unreachableDefinitions`
 * makes master emit `export type StatusBlock = StatusBlock` plus a duplicate
 * `StatusBlock1` interface. Same input and file name as PR #712's test; the
 * snapshot entry holds #712's expected output (one `StatusBlock`), so this
 * fails on master.
 */
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
