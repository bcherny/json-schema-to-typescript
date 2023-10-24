// @see https://github.com/bcherny/json-schema-to-typescript/pull/328
export const input = {
  title: 'UnionWithProps',
  type: 'object',
  anyOf: [
    {
      type: 'object',
      required: ['obj_type', 'type'],
      properties: {
        obj_type: {type: 'string', enum: ['Foo']},
        foo_type: {type: 'string'},
      },
    },
    {
      type: 'object',
      required: ['health', 'obj_type', 'team', 'type'],
      properties: {
        obj_type: {type: 'string', enum: ['Bar']},
        bar_type: {type: 'string'},
        team: {type: 'string'},
        health: {type: 'integer', format: 'uint', minimum: 0.0},
      },
    },
  ],
  required: ['coords', 'id'],
  properties: {
    coords: {type: 'number'},
    id: {type: 'integer'},
  },
}
