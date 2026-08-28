/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/440
 * Draft 3 property-level `required: true` next to the draft 4+ forms it must not
 * disturb: the parent's `required` array still applies, `required: false` stays
 * optional, and a property whose own `required` is an *array* (which of its
 * properties are required) is not itself marked required by that array.
 */
export const input = {
  title: 'Mixed',
  type: 'object',
  additionalProperties: false,
  required: ['listed'],
  properties: {
    // required: listed in the parent's array (draft 4+)
    listed: {type: 'string'},
    // required: flagged on the property (draft 3)
    flagged: {type: 'number', required: true},
    // optional
    unflagged: {type: 'number', required: false},
    plain: {type: 'boolean'},
    // optional: `required` here is address's own list, so `street` is required but `address` is not
    address: {
      type: 'object',
      additionalProperties: false,
      required: ['street'],
      properties: {
        street: {type: 'string'},
        city: {type: 'string'},
      },
    },
    // draft 3 all the way down: `contact` is required and so is `contact.email`
    contact: {
      type: 'object',
      required: true,
      additionalProperties: false,
      properties: {
        email: {type: 'string', required: true},
        phone: {type: 'string', required: false},
      },
    },
    // a flagged property counts as required when the index signature type is widened
    // to cover named properties, exactly like one listed in the array
    labels: {
      type: 'object',
      additionalProperties: {type: 'string'},
      properties: {
        primary: {type: 'string', required: true},
      },
    },
    // the flag travels with a referenced schema
    viaRef: {$ref: '#/definitions/flaggedString'},
  },
  definitions: {
    flaggedString: {type: 'string', required: true},
  },
}
