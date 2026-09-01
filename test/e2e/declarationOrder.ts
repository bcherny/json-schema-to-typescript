/**
 * Declarations come out root first, then each named type right after the first declaration that
 * refers to it, in the order a reader meets the references (depth first), whatever its kind;
 * definitions nothing refers to follow, in schema order. One blank line separates declarations.
 */
export const input = {
  title: 'Order',
  type: 'object',
  additionalProperties: false,
  properties: {
    customer: {$ref: '#/definitions/customer'},
    lines: {type: 'array', items: {$ref: '#/definitions/line'}, title: 'Lines'},
    status: {enum: ['open', 'paid'], tsEnumNames: ['Open', 'Paid'], title: 'Status'},
    currency: {$ref: '#/definitions/currency'},
  },
  required: ['customer', 'lines', 'status'],
  definitions: {
    address: {
      title: 'Address',
      type: 'object',
      properties: {street: {type: 'string'}, country: {$ref: '#/definitions/country'}},
      additionalProperties: false,
    },
    country: {title: 'Country', type: 'string', minLength: 2, maxLength: 2},
    currency: {title: 'Currency', enum: ['EUR', 'USD']},
    customer: {
      title: 'Customer',
      type: 'object',
      properties: {name: {type: 'string'}, address: {$ref: '#/definitions/address'}},
      required: ['name'],
      additionalProperties: false,
    },
    line: {
      title: 'Line',
      type: 'object',
      properties: {sku: {type: 'string'}, price: {$ref: '#/definitions/money'}},
      additionalProperties: false,
    },
    money: {title: 'Money', type: 'number'},
    voucher: {title: 'Voucher', description: 'Not referenced by the root type', type: 'string'},
  },
}

export const options = {
  unreachableDefinitions: true,
}
