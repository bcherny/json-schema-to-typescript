// The empty schema `{}` (and, with issue 654's fix, an annotation-only schema such as
// `{description: '...'}`) matches any value, so inside an `allOf` it adds no constraint:
// `allOf: [{$ref: User}, {}]` is just `User`. The optimizer used to collapse the whole
// intersection to `unknown` instead, silently dropping `User` from the output.
export const input = {
  title: 'AllOfEmptySchema',
  type: 'object',
  properties: {
    // OpenAPI-style: a $ref wrapped in allOf with a sibling member -> User
    owner: {
      allOf: [{$ref: '#/definitions/User'}, {}],
    },
    // In array items -> Tag[]
    tags: {
      type: 'array',
      items: {
        allOf: [{}, {$ref: '#/definitions/Tag'}],
      },
    },
    // More than one real member survives -> User & Tag
    taggedUser: {
      allOf: [{$ref: '#/definitions/User'}, {}, {$ref: '#/definitions/Tag'}],
    },
    // Nothing but empty schemas -> still unknown
    anything: {
      allOf: [{}, {}],
    },
    // `any` also absorbs in a union, so anyOf/oneOf are unchanged -> unknown
    ownerOrAnything: {
      anyOf: [{$ref: '#/definitions/User'}, {}],
    },
  },
  additionalProperties: false,
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: {type: 'string'},
      },
      required: ['id'],
      additionalProperties: false,
    },
    Tag: {
      type: 'object',
      properties: {
        name: {type: 'string'},
      },
      additionalProperties: false,
    },
  },
}
