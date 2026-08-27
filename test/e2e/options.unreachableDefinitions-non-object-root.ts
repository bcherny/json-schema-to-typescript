/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/439
 * `unreachableDefinitions` only emits definitions when the root schema is an
 * object; with a `number` root, `Unreached` is dropped. Same input and file
 * name as PR #714's test; the snapshot entry holds #714's expected output, so
 * this fails on master.
 */
export const input = {
  type: 'number',
  definitions: {
    unreached: {
      type: 'boolean',
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}
