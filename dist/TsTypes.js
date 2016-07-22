"use strict";
const lodash_1 = require('lodash');
exports.DEFAULT_SETTINGS = {
    declareSimpleType: false,
    declareReferenced: true,
    useFullReferencePathAsName: false,
    // declareProperties: false,
    useInterfaceDeclaration: false,
    endTypeWithSemicolon: true,
    endPropertyWithSemicolon: true,
    declarationDescription: true,
    propertyDescription: true,
};
class TsType {
    safeId() {
        return this.id && lodash_1.upperFirst(lodash_1.camelCase(this.id));
    }
    toBlockComment(settings) {
        return this.description && settings.declarationDescription ? `/** ${this.description} */\n` : '';
    }
    _toDeclaration(decl, settings) {
        return this.toBlockComment(settings) + decl + (settings.endTypeWithSemicolon ? ";" : "");
    }
    isSimpleType() { return true; }
    toDeclaration(settings) {
        return this._toDeclaration(`type ${this.safeId()} = ${this._type(settings)}`, settings);
    }
    toSafeType(settings) {
        return this.toType(settings);
    }
    toType(settings) {
        return this.safeId() || this._type(settings);
    }
    toString() {
        return this._type(exports.DEFAULT_SETTINGS);
    }
}
exports.TsType = TsType;
class Any extends TsType {
    _type() {
        return 'any';
    }
}
exports.Any = Any;
class String extends TsType {
    _type() {
        return 'string';
    }
}
exports.String = String;
class Boolean extends TsType {
    _type() {
        return 'boolean';
    }
}
exports.Boolean = Boolean;
class Number extends TsType {
    _type() {
        return 'number';
    }
}
exports.Number = Number;
class Object extends TsType {
    _type() {
        return 'Object';
    }
}
exports.Object = Object;
class Void extends TsType {
    _type() {
        return 'void';
    }
}
exports.Void = Void;
class Literal extends TsType {
    constructor(value) {
        super();
        this.value = value;
    }
    _type() {
        return this.value;
    }
}
exports.Literal = Literal;
class Array extends TsType {
    constructor(type) {
        super();
        this.type = type;
    }
    _type(settings) {
        return `${(this.type || new Any()).toSafeType(settings)}[]`;
    }
}
exports.Array = Array;
class Intersection extends TsType {
    constructor(data) {
        super();
        this.data = data;
    }
    isSimpleType() { return this.data.filter(_ => !(_ instanceof Void)).length <= 1; }
    _type(settings) {
        return this.data
            .filter(_ => !(_ instanceof Void))
            .map(_ => _.toSafeType(settings))
            .join('&');
    }
    toSafeType(settings) {
        return `${this.toType(settings)}`;
    }
}
exports.Intersection = Intersection;
class Union extends Intersection {
    isSimpleType() { return this.data.length <= 1; }
    _type(settings) {
        return this.data
            .map(_ => _.toSafeType(settings))
            .join('|');
    }
}
exports.Union = Union;
class Interface extends TsType {
    constructor(props) {
        super();
        this.props = props;
    }
    static reference(id) {
        let ret = new Interface([]);
        ret.id = id;
        return ret;
    }
    _type(settings, declaration = false) {
        let id = this.safeId();
        return declaration || !id ? `{
        ${this.props.map(_ => {
            let decl = _.name;
            if (!_.required)
                decl += '?';
            decl += ": " + _.type.toType(settings);
            if (settings.endPropertyWithSemicolon)
                decl += ';';
            if (settings.propertyDescription && _.type.description)
                decl += ' // ' + _.type.description;
            return decl;
        }).join('\n')}
      }` : id;
    }
    isSimpleType() { return false; }
    toDeclaration(settings) {
        if (settings.useInterfaceDeclaration)
            return `${this.toBlockComment(settings)}interface ${this.safeId()} ${this._type(settings, true)}`;
        else
            return this._toDeclaration(`type ${this.safeId()} = ${this._type(settings, true)}`, settings);
    }
}
exports.Interface = Interface;
//# sourceMappingURL=TsTypes.js.map