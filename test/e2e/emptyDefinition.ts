// Reported in #326
export const input = {
  additionalProperties: {
    $ref: '#/definitions/MyInterface',
  },
  definitions: {
    MyInterface: {},
  },
}
