import { CustomNameFunctionOptions } from '../../src/'

export const input = {
  type: 'object',
  id: 'FooId',
  title: 'FooTitle',
  definitions: {
    defaa: { id: "defaa-id" },
    defab: { id: "defab-id" },
  },
  properties: {
    propaaa: { "$ref": "#/definitions/defaa" },
    propaab: { "$ref": "#/definitions/defaa" },
    propbbb: { id: "propbbb-id", title: "propbbb-title" },
  },
}

export const options = {
  customName: (options: CustomNameFunctionOptions): string | undefined => {
    let result = options.definitionKeyName || options.keyName || 'FooRootName';
    return result;
  }
}
