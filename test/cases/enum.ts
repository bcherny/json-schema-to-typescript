export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "foo": {
      "enum": ["a", "b", "c"]
    },
    "bar": {
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    },
    "baz": {
      "enum": [
        { "a": 1 },
        { "a": 2 },
        { "a": 3 }
      ]
    }
  },
  "required": ["foo", "bar", "baz"],
  "additionalProperties": false
}

export var configurations = [
  {
    settings: {
      useTypescriptEnums: false
    },
    types: `interface Enum {
  foo: "a" | "b" | "c";
  bar: number;
  baz: {
    a: number;
  };
}`
  }, 
  {
    settings: {
      useTypescriptEnums: true
    },
    types: `enum Foo {
  a,
  b,
  c
}
enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
enum Baz {
  [object Object],
  [object Object],
  [object Object]
}
interface Enum {
  foo: Foo;
  bar: Bar;
  baz: Baz;
}`
  },
    {
    settings: {
      useTypescriptEnums: true,
      addEnumUtils: true
    },
    types: `enum Foo {
  a,
  b,
  c
}
class FooUtil {
  static values(): Foo[] {
    return [Foo.a, Foo.b, Foo.c]
  }
  static toStringValue(enm: Foo): Foo {
    switch (enm.toLowerCase()) {
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
enum Bar {
  One = 1,
  Two = 2,
  Three = 3
}
class BarUtil {
  static values(): Bar[] {
    return [Bar.One, Bar.Two, Bar.Three]
  }
  static toStringValue(enm: Bar): Bar {
    switch (enm.toLowerCase()) {
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
enum Baz {
  [object Object],
  [object Object],
  [object Object]
}
class BazUtil {
  static values(): Baz[] {
    return [Baz.[object Object], Baz.[object Object],Baz.[object Object]]
  }
  static toStringValue(enm: Baz): Baz {
    switch (enm.toLowerCase()) {
      case Baz.[object Object]:
        return "[object object]";
      case Baz.[object Object]:
        return "[object object]";
      case Baz.[object Object]:
        return "[object object]";
    }
  }
  static fromStringValue(value: string): Baz {
    switch (value.toLowerCase()) {
      case "[object object]":
        return Baz.[object Object];
      case "[object object]":
        return Baz.[object Object];
      case "[object object]":
        return Baz.[object Object];
      default:
        throw new Error("Unrecognized Baz: " + value);
    }
  }
  static fromStringValues(values: string[]): Baz[] {
    return _.map(values, value => BazUtil.fromStringValue(value));
  }
}
interface Enum {
  foo: Foo;
  bar: Bar;
  baz: Baz;
}`
  }
]
