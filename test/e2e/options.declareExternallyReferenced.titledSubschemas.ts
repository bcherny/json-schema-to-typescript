/** @see https://github.com/bcherny/json-schema-to-typescript/issues/311 */
// Nothing here is referenced from another file, so `declareExternallyReferenced: false`
// should change nothing. On master it suppresses the declarations of the *internal*
// titled sub-schemas (`Template`, `Name`, `Configuration`) while `Package` still
// refers to them, so the output does not compile. (typecheck.test.ts skips
// `declareExternallyReferenced: false` cases, which is why the suite stays green.)
export const input = {
  type: 'object',
  title: 'Package',
  description: 'Definition for a Package.',
  properties: {
    template: {
      type: 'string',
      title: 'Template',
      description: 'Name of the template used for creating this package.',
    },
    name: {
      type: 'string',
      title: 'Name',
      description: 'Name of this package.',
    },
    configuration: {
      type: 'object',
      properties: {},
      title: 'Configuration',
      description: 'Configuration of this package',
    },
  },
  additionalProperties: false,
  required: ['template', 'name', 'configuration'],
}

export const options = {
  declareExternallyReferenced: false,
}
