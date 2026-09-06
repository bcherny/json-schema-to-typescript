// A closed empty base (`[k: string]: never`) cannot be named in an `extends` clause: its never
// index signature would reject every property the extending interface declares (TS2411), so the
// child is printed as an intersection instead. That must hold when the base also carries
// definitions under `unreachableDefinitions` (they are declared beside the signature, not members).
export const input = {
  title: 'Child',
  type: 'object',
  extends: [
    {
      title: 'Base',
      type: 'object',
      additionalProperties: false,
      definitions: {
        d: {
          title: 'D',
          type: 'string',
        },
      },
    },
  ],
  properties: {
    x: {type: 'string'},
  },
  required: ['x'],
  additionalProperties: false,
}

export const options = {
  unreachableDefinitions: true,
}
