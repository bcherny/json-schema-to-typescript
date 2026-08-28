// Two same-titled object schemas whose `extends` point at different base schemas → distinct names,
// both bases emitted.
export const input = {
  title: 'DedupExtendsCollision',
  type: 'object',
  properties: {
    a: {
      title: 'Child',
      type: 'object',
      extends: [
        {
          title: 'BaseA',
          type: 'object',
          properties: {
            x: {type: 'number'},
          },
        },
      ],
      properties: {
        own: {type: 'string'},
      },
    },
    b: {
      title: 'Child',
      type: 'object',
      extends: [
        {
          title: 'BaseB',
          type: 'object',
          properties: {
            y: {type: 'number'},
          },
        },
      ],
      properties: {
        own: {type: 'string'},
      },
    },
  },
}
