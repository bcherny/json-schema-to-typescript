export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "enum": ["a", "b", "c"]
    },
    "bar": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    }
  },
  "required": ["foo", "bar"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      useConstEnums: false
    },
    types: `export enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: "a" | "b" | "c";
  bar: Bar;
}`
  },
  {
    settings: {
      useConstEnums: true
    },
    types: `export const enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: "a" | "b" | "c";
  bar: Bar;
}`
  },
    {
    settings: {
      addEnumUtils: true
    },
    types: `export enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export class BarUtil {
  static values(): Bar[] {
    return [Bar.One, Bar.Two, Bar.Three]
  }
  static toStringValue(enm: Bar): string {
    switch (enm) {
      case Bar.One:
        return "one";
      case Bar.Two:
        return "two";
      case Bar.Three:
        return "three";
    }
  }
  static fromStringValue(value: string): Bar {
    switch (value.toLowerCase()) {
      case "one":
        return Bar.One;
      case "two":
        return Bar.Two;
      case "three":
        return Bar.Three;
      default:
        throw new Error("Unrecognized Bar: " + value);
    }
  }
  static fromStringValues(values: string[]): Bar[] {
    return _.map(values, value => BarUtil.fromStringValue(value));
  }
}
export interface Enum {
  foo: "a" | "b" | "c";
  bar: Bar;
}`
  }
]
