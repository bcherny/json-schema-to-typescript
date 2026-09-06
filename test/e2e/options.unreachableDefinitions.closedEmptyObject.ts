// A closed object with no members of its own prints `[k: string]: never` (issue 486). With
// `unreachableDefinitions` on, its definitions are members of the same interface node (rendered as
// standalone declarations, never as properties), which must not make the object read as non-empty.
export const input = {
  title: 'ClosedEmptyObject',
  type: 'object',
  additionalProperties: false,
  definitions: {
    d: {
      title: 'D',
      type: 'string',
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}
