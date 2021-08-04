import { DEFAULT_OPTIONS } from '../../src'

export const input = {
  title: 'Example Schema -- BigInt Enabled',
  type: 'object',
  additionalProperties: false,
  properties: {
    secondsSinceDawnOfTime: {
      type: 'integer'
    },
    reasonablySizedNumber: {
      type: 'integer',
      maximum: 42
    }
  }
}

export const options = {
  ...DEFAULT_OPTIONS,
  enableBigInt: true
}
