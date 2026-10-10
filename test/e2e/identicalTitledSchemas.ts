// https://github.com/bcherny/json-schema-to-typescript/issues/510
// Identical inline schemas with the same title share one generated declaration.
export const input = {
  title: 'Rectangle',
  type: 'object',
  properties: {
    p1: {
      title: 'Point',
      type: 'object',
      properties: {x: {type: 'number'}, y: {type: 'number'}},
      required: ['x', 'y'],
    },
    p2: {
      title: 'Point',
      type: 'object',
      properties: {x: {type: 'number'}, y: {type: 'number'}},
      required: ['x', 'y'],
    },
    distinctPoint: {
      title: 'Point',
      type: 'object',
      properties: {x: {type: 'number'}, y: {type: 'number'}, z: {type: 'number'}},
      required: ['x', 'y', 'z'],
    },
  },
  required: ['p1', 'p2', 'distinctPoint'],
}
