export const input = {
  type: 'object',
  properties: {
    a: {
      const: '',
      nullable: true,
    },
    b: {
      const: null,
      nullable: true,
    },
    c: {
      enum: ['a', 'b'],
      nullable: true,
    },
    d: {
      enum: ['', null],
      nullable: true,
    },
    e: {
      type: 'string',
      nullable: true,
    },
    f: {
      type: 'null',
      nullable: true,
    },
    g: {
      type: 'string',
      const: '',
      nullable: true,
    },
    h: {
      type: 'string',
      const: null,
      nullable: true,
    },
    i: {
      type: 'string',
      enum: ['a', 'b'],
      nullable: true,
    },
    j: {
      type: 'string',
      enum: ['', null],
      nullable: true,
    },
    k: {
      type: ['string', 'integer'],
      nullable: true,
    },
    l: {
      type: ['string', 'null'],
      nullable: true,
    },
  },
  additionalProperties: false,
}
