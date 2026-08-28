// https://github.com/bcherny/json-schema-to-typescript/issues/369
export const input = {
  title: 'Demo',
  type: 'object',
  additionalProperties: false,
  properties: {
    hostname: {type: 'string'},
    enable_subconfig: {type: 'boolean'},
  },
  required: ['enable_subconfig'],
  allOf: [
    {
      if: {properties: {enable_subconfig: {enum: [true]}}},
      then: {required: ['hostname']},
      else: {},
    },
  ],
}
