export const input = {
  $schema: 'http://json-schema.org/draft/2019-09/schema#',
  title: 'Example Schema',
  type: 'object',
  deprecated: true,
  description: 'comment',
  properties: {
    // https://github.com/bcherny/json-schema-to-typescript/issues/548
    firstName: {
      type: 'string',
      deprecated: true,
    },
    middleName: {
      type: 'string',
      deprecated: true,
      description: "Hi, my name's Doechii, this will be in a  comment",
    },
    lastName: {
      type: 'string',
      deprecated: false,
      description: 'nested comment',
    },
    // https://github.com/bcherny/json-schema-to-typescript/issues/540
    description: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['firstName'],
}
