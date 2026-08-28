// `extends` (draft 3: an instance must also validate against the base schemas) is printed as an
// `interface … extends` clause only when every base is a named object type an interface may
// extend. Any other base -- the empty schema (`unknown`), a primitive, a union, a closed empty
// object (its `never` index signature would reject every property declared here), or an inline
// base with no name of its own -- turns the declaration into the intersection `extends` stands
// for, as `declarationStyle: 'type'` already prints it. Before, these came out as
// `interface A extends B` with `type B = unknown` / `string` / `(X | Y)` (TS2312), as TS2411
// against the `never` index signature, and as `interface E extends  {` for the unnamed base.
export const input = {
  title: 'Extends',
  type: 'object',
  properties: {
    any: {$ref: '#/definitions/extendsAny'},
    string: {$ref: '#/definitions/extendsString'},
    union: {$ref: '#/definitions/extendsUnion'},
    closedEmpty: {$ref: '#/definitions/extendsClosedEmpty'},
    inline: {$ref: '#/definitions/extendsInline'},
    mixed: {$ref: '#/definitions/extendsMixed'},
    named: {$ref: '#/definitions/extendsNamed'},
  },
  additionalProperties: false,
  definitions: {
    empty: {},
    label: {type: 'string'},
    circleOrSquare: {
      oneOf: [
        {type: 'object', properties: {radius: {type: 'number'}}, required: ['radius']},
        {type: 'object', properties: {side: {type: 'number'}}, required: ['side']},
      ],
    },
    nothing: {type: 'object', additionalProperties: false},
    base: {type: 'object', properties: {id: {type: 'string'}}, required: ['id']},
    extendsAny: {
      type: 'object',
      extends: {$ref: '#/definitions/empty'},
      properties: {a: {type: 'number'}},
    },
    extendsString: {
      type: 'object',
      extends: {$ref: '#/definitions/label'},
      properties: {b: {type: 'number'}},
    },
    extendsUnion: {
      type: 'object',
      extends: {$ref: '#/definitions/circleOrSquare'},
      properties: {c: {type: 'number'}},
    },
    extendsClosedEmpty: {
      type: 'object',
      extends: {$ref: '#/definitions/nothing'},
      properties: {d: {type: 'number'}},
    },
    extendsInline: {
      type: 'object',
      extends: {type: 'object', properties: {inlined: {type: 'boolean'}}},
      properties: {e: {type: 'number'}},
    },
    // one base an interface could extend and one it could not: the whole clause becomes an
    // intersection, so that no base is dropped
    extendsMixed: {
      type: 'object',
      extends: [{$ref: '#/definitions/base'}, {$ref: '#/definitions/circleOrSquare'}],
      properties: {f: {type: 'number'}},
    },
    // control: a named object base keeps the `extends` clause
    extendsNamed: {
      type: 'object',
      extends: {$ref: '#/definitions/base'},
      properties: {g: {type: 'number'}},
    },
  },
}
