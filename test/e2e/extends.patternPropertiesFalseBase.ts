// A base whose `never` index signature comes from `patternProperties: {…: false}` beside a declared
// property is not the closed empty object: the generator widens that signature with the property
// types (`never | string | undefined`), so the base is extendable and the child keeps its `extends`.
export const input = {
  title: 'Child',
  type: 'object',
  extends: [
    {
      title: 'Base',
      type: 'object',
      properties: {
        a: {type: 'string'},
      },
      patternProperties: {
        '^x-': false,
      },
      additionalProperties: false,
    },
  ],
  properties: {
    x: {type: 'string'},
  },
  required: ['x'],
  additionalProperties: false,
}
