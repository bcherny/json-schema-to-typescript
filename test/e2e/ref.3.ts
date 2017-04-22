export const input = {
  title: 'Referencing3',
  type: 'object',
  properties: {
    foo: {
      $ref: 'https://raw.githubusercontent.com/bcherny/json-schema-to-typescript/4531fd7da2c2dbed3b2887fd7035ff18573edb82/test/resources/ReferencedType.json'
    }
  },
  required: ['foo'],
  additionalProperties: false
}

export const output = `export interface Referencing3 {
  foo: ExampleSchema;
}
export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  height?: number;
  favoriteFoods?: any[];
  likesDogs?: boolean;
  [k: string]: any;
}
`
