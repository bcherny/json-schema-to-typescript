export const input = {
  title: 'ILinkProps',
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  extends: [
    {
      $ref: '#/definitions/anchor'
    },
    {
      $ref: '#/definitions/link'
    }
  ],
  properties: {
    visited: {
      type: 'boolean'
    },
    external: {
      type: 'boolean'
    },
    icon: {
      type: 'boolean'
    },
    to: {
      type: 'string'
    },
    component: {
      $ref: '#/definitions/component'
    }
  },
  definitions: {
    component: {
      tsType: 'React.ComponentClass | React.SFC'
    },
    anchor: {
      title: 'Anchor',
      description: 'Default HTML Anchor Element',
      tsType: 'React.AnchorHTMLAttributes<HTMLAnchorElement>'
    },
    link: {
      title: 'Link',
      tsType: 'React.LinkHTMLAttributes<HTMLLinkElement>'
    }
  },
  additionalProperties: false
}
