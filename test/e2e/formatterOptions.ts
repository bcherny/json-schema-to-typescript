import { Options } from '../../src/'

export let input = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      id: 'lastName',
      type: 'string'
    }
  },
  required: ['firstName', 'lastName']
}

export let options: Partial<Options> = {
  style: {
    semi: false,
    trailingComma: 'all',
    useTabs: true
  }
}
