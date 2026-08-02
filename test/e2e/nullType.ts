export const input = {
  type: 'object',
  additionalProperties: false,
  required: ['nullProp'],
  properties: {
    nullProp: {type: null},
  },
}
