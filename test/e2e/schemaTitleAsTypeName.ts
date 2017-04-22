export const input = {
  $schema: 'http://json-schema.org/draft-03/schema',
  id: 'http://mycompany.com/api/referencing.json',
  title: 'Referencing',
  type: 'object',
  properties: {
    ref: {
      $ref: 'test/resources/ReferencedType.json'
    }
  },
  required: ['ref'],
  additionalProperties: false
}

/**
 * Verify that both generated types names are derived from the schema.title
 */
export const output = `export interface Referencing {
  ref: ExampleSchema;
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
