export const input = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      nullable: true
    },
    bar: {
      type: ['string', 'number'],
      nullable: true
    }
  }
}
