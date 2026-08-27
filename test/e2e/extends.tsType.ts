/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/211
 * Regression guard: `extends` targets honour `tsType` (fixed in 10.0.0 by 2b406f9);
 * a second `extends` of the same definition must not emit a duplicate `Anchor1`.
 */
export const input = {
  title: 'ILinkProps',
  type: 'object',
  extends: {$ref: '#/definitions/anchor'},
  properties: {
    visited: {type: 'boolean'},
    component: {$ref: '#/definitions/component'},
    button: {$ref: '#/definitions/button'},
  },
  definitions: {
    component: {tsType: 'string | number'},
    anchor: {title: 'Anchor', tsType: '{href?: string}'},
    button: {
      title: 'Button',
      type: 'object',
      extends: {$ref: '#/definitions/anchor'},
      properties: {pressed: {type: 'boolean'}},
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}
