export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    foo: {
      $ref: 'ReferencedType.json'
    }
  },
  required: ['foo'],
  additionalProperties: false
}

export const options = {
  cwd: 'test/resources/'
}

export const output = `export interface Referencing {
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
