// @see https://github.com/bcherny/json-schema-to-typescript/issues/671
export const input = {
  type: 'object',
  title: 'test',
  properties: {
    gid: {type: 'string'},
  },
  patternProperties: {
    '^x-.*$': {type: 'number'},
  },
}
