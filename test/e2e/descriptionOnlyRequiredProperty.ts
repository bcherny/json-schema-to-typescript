/** @see https://github.com/bcherny/json-schema-to-typescript/issues/176 */
// A required property whose schema carries only an (empty) annotation keyword must type
// like `{}` does: `data: unknown`, not `data: {[k: string]: unknown}`.
export const input = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Event',
  properties: {
    data: {description: ''},
  },
  additionalProperties: false,
  required: ['data'],
}
