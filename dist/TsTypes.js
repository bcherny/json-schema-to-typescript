"use strict";
class TsType {
}
exports.TsType = TsType;
class Any extends TsType {
    toString() {
        return 'any';
    }
}
exports.Any = Any;
class Array extends TsType {
    constructor(type) {
        super();
        this.type = type;
    }
    toString() {
        return `${this.type ? this.type.toString() : (new Any()).toString()}[]`;
    }
}
exports.Array = Array;
class Boolean extends TsType {
    toString() {
        return 'boolean';
    }
}
exports.Boolean = Boolean;
class Class extends TsType {
    constructor(name) {
        super();
        this.name = name;
    }
    toString() {
        return this.name;
    }
}
exports.Class = Class;
class Literal extends TsType {
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return `"${this.value}"`; // TODO: support Number, Boolean, Array, and Object literals
    }
}
exports.Literal = Literal;
class Number extends TsType {
    toString() {
        return 'number';
    }
}
exports.Number = Number;
class Object extends TsType {
    toString() {
        return 'Object';
    }
}
exports.Object = Object;
class String extends TsType {
    toString() {
        return 'string';
    }
}
exports.String = String;
class Union extends TsType {
    constructor(data) {
        super();
        this.data = data;
    }
    toString() {
        return this.data.join('|');
    }
}
exports.Union = Union;
class Void extends TsType {
    toString() {
        return 'void';
    }
}
exports.Void = Void;
class InterfaceProperty extends TsType {
    constructor(data) {
        super();
        this.data = data;
    }
    toString() {
        return [
            this.data.key,
            `${this.data.isRequired ? '' : '?'}: `,
            `${this.data.value.toString()};`,
            this.data.description ? ` // ${this.data.description}` : ''
        ].join('');
    }
}
exports.InterfaceProperty = InterfaceProperty;
class Interface extends TsType {
    constructor(data) {
        super();
        this.data = data;
    }
    get name() { return this.data.name; }
    toBlockComment(a) {
        return `/*
    ${a}
  */
    `;
    }
    toString() {
        return `${this.data.description
            ? this.toBlockComment(this.data.description)
            : ''}interface ${this.data.name} {
        ${this.data.props.join('\n')}
      }`;
    }
}
exports.Interface = Interface;
//# sourceMappingURL=TsTypes.js.map