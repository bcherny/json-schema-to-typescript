/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/660
 * Companion to arrayItemsWithDescription.ts: an item description that carries a
 * JSDoc block tag is NOT hoisted into the array's comment, because TypeScript would
 * read the tag (here `@deprecated`) as applying to the array declaration itself.
 * Output for this case is identical to master.
 */
export const input = {
  title: 'Release',
  type: 'object',
  properties: {
    addon_plan_names: {
      type: 'array',
      description: 'add-on plans installed on the app for this release',
      items: {type: 'string', description: '@deprecated use addon_plan_ids'},
    },
    mentions: {
      type: 'array',
      items: {type: 'string', description: 'a handle, written @name'},
    },
  },
  additionalProperties: false,
  definitions: {
    tagged: {
      title: 'TaggedList',
      type: 'array',
      description: 'Standalone array type',
      items: {type: 'string', description: '@minLength 3'},
    },
  },
}
export const options = {unreachableDefinitions: true}
