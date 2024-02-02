export const input = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      title: 'First Name',
      type: 'string',
    },
    lastName: {
      title: 'Last Name',
      id: 'lastName',
      type: 'string',
    },
    age: {
      title: 'The Age of The Person This Represents',
      description: 'Age in years',
      type: 'integer',
      minimum: 0,
    },
    height: {
      title: 'Height in Feet',
      $id: 'height',
      type: 'number',
    },
    favoriteFoods: {
      title: 'What Foods They Like',
      type: 'array',
    },
    likesDogs: {
      title: 'Whether they Like Dogs',
      type: 'boolean',
    },
  },
  required: ['firstName', 'lastName'],
}

export const options = {
  useTitleAsType: true,
}
