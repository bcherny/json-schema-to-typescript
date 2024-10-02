export const input = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        age: {type: 'number'},
        hobbies: {
          type: 'array',
          items: {type: 'string'},
        },
      },
    },
  },
}

export const options = {
  readonly: true,
}

export const output = `export interface User {
  readonly name?: string;
  readonly age?: number;
  readonly hobbies?: readonly string[];
}

export interface Root {
  readonly user?: User;
}`
