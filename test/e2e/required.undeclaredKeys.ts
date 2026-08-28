/**
 * A key listed in `required` has to be present whether or not `properties` declares it (in every
 * draft: `required` and `properties` are independent keywords), so a key with no `properties`
 * entry is still a required member. Its type is whatever the schema says about a value at that
 * key: the `patternProperties` it matches, else `additionalProperties` when that is a schema,
 * else `unknown` -- also under `additionalProperties: false`, where the schema can't in fact be
 * satisfied (a `never` member would say that, and make the whole type unusable over what is
 * usually a typo). A key that a sibling `allOf` member declares takes that member's type instead
 * (see requiredNextToRef.ts).
 */
export const input = {
  title: 'UndeclaredKeys',
  type: 'object',
  properties: {
    // declared and undeclared keys side by side
    root: {
      type: 'object',
      properties: {a: {type: 'string'}},
      required: ['a', 'b'],
    },
    // one level further down, same thing
    nested: {
      type: 'object',
      properties: {
        inner: {
          type: 'object',
          properties: {a: {type: 'string'}},
          required: ['a', 'b'],
        },
      },
      required: ['inner', 'other'],
    },
    // `required` with no `properties` at all (k8s, GitHub REST, compose-spec do this)
    noProperties: {
      type: 'object',
      required: ['foo', 'bar'],
    },
    // closed: `b` is required yet not allowed -- typed `unknown` rather than `never`
    closed: {
      type: 'object',
      additionalProperties: false,
      properties: {a: {type: 'string'}},
      required: ['a', 'b'],
    },
    closedNoProperties: {
      type: 'object',
      additionalProperties: false,
      required: ['b'],
    },
    // a key matched by a pattern takes the pattern's type; one matched by none takes
    // `additionalProperties`' type
    pattern: {
      type: 'object',
      patternProperties: {'^n': {type: 'number'}, '^s': {type: 'string'}},
      additionalProperties: {type: 'boolean'},
      required: ['n1', 's1', 'other'],
    },
    // typed `additionalProperties` alone
    typedAdditionalProperties: {
      type: 'object',
      additionalProperties: {type: 'string'},
      required: ['b'],
    },
    // a key an `allOf` member declares takes the member's type, not `unknown`
    allOfSibling: {
      type: 'object',
      properties: {a: {type: 'string'}},
      required: ['a', 'b', 'c'],
      allOf: [{type: 'object', properties: {b: {type: 'number'}}}],
    },
    // keys that need quoting
    quoted: {
      type: 'object',
      properties: {a: {type: 'string'}},
      required: ['a', 'hyphen-key', 'has space', '1digit'],
    },
    // an object that may also be null: only its object half gains the member
    nullable: {
      type: ['object', 'null'],
      properties: {a: {type: 'string'}},
      required: ['a', 'b'],
    },
    // `anyOf` branches with no `properties` around them to borrow from
    anyOf: {
      type: 'object',
      anyOf: [{required: ['a']}, {required: ['b']}],
    },
    // a sibling `required` no branch declares: every object branch gains it, others don't
    anyOfSiblingRequired: {
      anyOf: [{type: 'object', properties: {a: {type: 'string'}}}, {type: 'string'}],
      required: ['b'],
    },
    // duplicates listed once
    duplicate: {
      type: 'object',
      required: ['b', 'b'],
    },
    // next to an allOf whose members all vanish from the output: rendered like a plain object,
    // index signature included, not as a lone `{a: unknown}`
    vacuousAllOf: {
      type: 'object',
      required: ['a'],
      allOf: [{not: {required: ['b']}}, {description: 'words'}],
    },
    // ...but not when a sibling anyOf/oneOf admits something other than an object: `null` stays
    // assignable, the object branch picks up the key on its own
    anyOfNullVacuousAllOf: {
      anyOf: [{type: 'object', properties: {a: {type: 'string'}}}, {type: 'null'}],
      allOf: [{if: {required: ['q']}, then: {required: ['r']}}],
      required: ['a'],
    },
    // ...nor when the schema itself renders as something other than an object (an enum here;
    // likewise `items` with no `type`, `const`): master's type, no object member in front
    enumVacuousAllOf: {
      enum: [{a: 1}, 'x'],
      allOf: [{not: {required: ['zz']}}],
      required: ['a'],
    },
    // a key the (draft 3 style) `extends` base declares takes the base's type, so that the
    // interface still extends it (`id: unknown` under `id?: string` would not compile)
    extendsBase: {
      title: 'ExtendsBase',
      type: 'object',
      extends: {$ref: '#/definitions/base'},
      properties: {x: {type: 'number'}},
      required: ['id', 'x'],
    },
  },
  required: ['root'],
  additionalProperties: false,
  definitions: {
    base: {
      type: 'object',
      properties: {id: {type: 'string'}},
    },
  },
}
