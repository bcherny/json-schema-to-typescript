// refWithSiblingKeywords.ts across files: the schema refers to address.json three times, twice
// with a description of its own, and address.json refers to country.json with and without one.
// One `Address`, one `Country`, and the descriptions on the properties that carry them.
export const input = {
  title: 'Delivery',
  type: 'object',
  additionalProperties: false,
  properties: {
    billing: {$ref: 'RefSiblings/address.json', description: 'Where the invoice goes'},
    shipping: {$ref: 'RefSiblings/address.json', description: 'Where the goods go', title: 'Shipping address'},
    sender: {$ref: 'RefSiblings/address.json'},
  },
  required: ['billing'],
}

export const options = {
  cwd: 'test/resources/',
}
