// A documented `$ref` under OpenAPI's `components/schemas` -- a position no JSON-Schema keyword
// leads to -- resolves to the one `Person`, like the same reference under `definitions` does.
export const input = {
  type: 'object',
  properties: {
    pet: {$ref: '#/components/schemas/Pet'},
  },
  additionalProperties: false,
  components: {
    schemas: {
      Person: {
        type: 'object',
        properties: {name: {type: 'string'}},
        additionalProperties: false,
      },
      Pet: {
        type: 'object',
        properties: {
          owner: {$ref: '#/components/schemas/Person', description: 'Who looks after it'},
          breeder: {$ref: '#/components/schemas/Person'},
        },
        additionalProperties: false,
      },
    },
  },
}
