export const input = {
  title: 'Example Schema -- BigInt Disabled',
  type: 'object',
  additionalProperties: false,
  properties: {
    secondsSinceDawnOfTime: {
      type: 'integer'
    },
    reasonablySizedNumber: {
      type: 'integer',
      minimum: 0,
      maximum: 42
    },
    safeSizedNumber: {
      type: 'integer',
      minimum: -9007199254740991,
      maximum: 9007199254740991
    },
    unsafeSizedNumber: {
      type: 'integer',
      minimum: -9007199254740992,
      maximum: 9007199254740992
    }
  }
}

export const options = {
  enableBigInt: false
}
