import {Options} from '../../src/'

export const input = {
  type: 'object',
  id: 'FooId',
  title: 'FooTitle',
  definitions: {
    defaa: {id: 'defaa-id'},
    defab: {id: 'defab-id'},
  },
  properties: {
    propaaa: {$ref: '#/definitions/defaa'},
    propaab: {$ref: '#/definitions/defaa'},
    propbbb: {id: 'propbbb-id', title: 'propbbb-title'},
  },
}

export const options: Partial<Options> = {
  customName: (_schema, keyName) => {
    if (!keyName)
      return undefined // Fallback to default naming
    return 'CustomPrefix_' + keyName
  },
}
