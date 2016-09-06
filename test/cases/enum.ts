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
      useTypescriptEnums: false
    },
    types: `export interface Enum {
  foo: "a" | "b" | "c";
  bar: number;
}`
  },
  {
    settings: {
      useTypescriptEnums: true
    },
    types: `export enum Foo {
  a,
  b,
  c
}
export enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: Foo;
  bar: Bar;
}`
  },
  {
    settings: {
      useTypescriptEnums: true,
      useConstEnums: true
    },
    types: `export const enum Foo {
  a,
  b,
  c
}
export const enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
export interface Enum {
  foo: Foo;
  bar: Bar;
}`
  },
    {
    settings: {
      useTypescriptEnums: true,
      addEnumUtils: true
    },
    types: `export enum Foo {
  a,
  b,
  c
}
export class FooUtil {
  static values(): Foo[] {
    return [Foo.a, Foo.b, Foo.c]
  }
  static toStringValue(enm: Foo): string {
    switch (enm) {
      case Foo.a:
        return "a";
      case Foo.b:
        return "b";
      case Foo.c:
        return "c";
    }
  }
  static fromStringValue(value: string): Foo {
    switch (value.toLowerCase()) {
      case "a":
        return Foo.a;
      case "b":
        return Foo.b;
      case "c":
        return Foo.c;
      default:
        throw new Error("Unrecognized Foo: " + value);
    }
  }
  static fromStringValues(values: string[]): Foo[] {
    return _.map(values, value => FooUtil.fromStringValue(value));
  }
}
export enum Bar {
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
  foo: Foo;
  bar: Bar;
}`
  }
]
