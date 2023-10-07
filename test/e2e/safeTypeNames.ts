export const input = {
  definitions: {
    "stra'nge#name": {
      properties: {
        a: {type: 'string'},
        b: {type: 'integer'},
      },
      additionalProperties: false,
      required: ['a'],
    },
    keepUPPERCASE: {
      properties: {
        a: {enum: ['a', 'b', 'c']},
      },
    },
    snake_case: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    _startsWithUnderscore: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    _StartsWithUnderscoreUppercase: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    EndsWithUnderscore_: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    UPPER_CASE: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    ______________: {
      properties: {
        a: {type: 'boolean'},
      },
    },
    camelCase: {
      properties: {
        a: {type: 'float'},
      },
    },
    'kebab-case': {
      properties: {
        a: {type: 'string'},
      },
    },
    ' startsWithSpace': {
      properties: {
        a: {type: 'string'},
      },
    },
    'contains space': {
      properties: {
        a: {type: 'string'},
      },
    },
    '5tartsWithDigit': {
      properties: {
        a: {type: 'string'},
      },
    },
    ' 5tartsWithBlankAndDigit': {
      properties: {
        a: {type: 'string'},
      },
    },
    endsWithDigi7: {
      properties: {
        a: {type: 'string'},
      },
    },
    contains4digit: {
      properties: {
        a: {type: 'string'},
      },
    },
    '.startsWithPeriod': {
      properties: {
        a: {type: 'string'},
      },
    },
    'endsWithPeriod.': {
      properties: {
        a: {type: 'string'},
      },
    },
    'contains...period': {
      properties: {
        a: {type: 'string'},
      },
    },
    ',startsWithComma': {
      properties: {
        a: {type: 'string'},
      },
    },
    'endsWithComma,': {
      properties: {
        a: {type: 'string'},
      },
    },
    'contains,,Comma': {
      properties: {
        a: {type: 'string'},
      },
    },
    $startsWithDollar: {
      properties: {
        a: {type: 'string'},
      },
    },
    endsWithDollar$: {
      properties: {
        a: {type: 'string'},
      },
    },
    contains$Dollar: {
      properties: {
        a: {type: 'string'},
      },
    },
    $: {
      properties: {
        a: {type: 'string'},
      },
    },
    UPPERCASE: {
      properties: {
        a: {type: 'string'},
      },
    },
    Startsuppercase: {
      properties: {
        a: {type: 'string'},
      },
    },
  },
}

export const options = {
  unreachableDefinitions: true,
}
