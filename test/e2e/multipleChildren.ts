export const input = {
  title: 'ILinkProps',
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  extends: {
    $ref: '#/definitions/anchor'
  },
  properties: {
    component: {
      $ref: '#/definitions/component'
    }
  },
  definitions: {
    component: {
      extends: {
        $ref: '#/definitions/anchor'
      },
      additionalProperties: false
    },
    anchor: {
      title: 'Anchor',
      tsType: 'React.AnchorHTMLAttributes<HTMLAnchorElement>',
      additionalProperties: false
    }
  },
  additionalProperties: false
}
