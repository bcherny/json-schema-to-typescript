"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lodash_1 = require('lodash');
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
var TsType = (function () {
    function TsType() {
    }
    TsType.prototype.safeId = function () {
        return this.id && lodash_1.upperFirst(lodash_1.camelCase(this.id));
    };
    TsType.prototype.toBlockComment = function (settings) {
        return this.description && settings.declarationDescription ? "/** " + this.description + " */\n" : '';
    };
    TsType.prototype._toDeclaration = function (decl, settings) {
        return this.toBlockComment(settings) + decl + (settings.endTypeWithSemicolon ? ";" : "");
    };
    TsType.prototype.isSimpleType = function () { return true; };
    TsType.prototype.toDeclaration = function (settings) {
        return this._toDeclaration("type " + this.safeId() + " = " + this._type(settings), settings);
    };
    TsType.prototype.toSafeType = function (settings) {
        return this.toType(settings);
    };
    TsType.prototype.toType = function (settings) {
        return this.safeId() || this._type(settings);
    };
    TsType.prototype.toString = function () {
        return this._type(exports.DEFAULT_SETTINGS);
    };
    return TsType;
}());
exports.TsType = TsType;
var Any = (function (_super) {
    __extends(Any, _super);
    function Any() {
        _super.apply(this, arguments);
    }
    Any.prototype._type = function () {
        return 'any';
    };
    return Any;
}(TsType));
exports.Any = Any;
var String = (function (_super) {
    __extends(String, _super);
    function String() {
        _super.apply(this, arguments);
    }
    String.prototype._type = function () {
        return 'string';
    };
    return String;
}(TsType));
exports.String = String;
var Boolean = (function (_super) {
    __extends(Boolean, _super);
    function Boolean() {
        _super.apply(this, arguments);
    }
    Boolean.prototype._type = function () {
        return 'boolean';
    };
    return Boolean;
}(TsType));
exports.Boolean = Boolean;
var Number = (function (_super) {
    __extends(Number, _super);
    function Number() {
        _super.apply(this, arguments);
    }
    Number.prototype._type = function () {
        return 'number';
    };
    return Number;
}(TsType));
exports.Number = Number;
var Object = (function (_super) {
    __extends(Object, _super);
    function Object() {
        _super.apply(this, arguments);
    }
    Object.prototype._type = function () {
        return 'Object';
    };
    return Object;
}(TsType));
exports.Object = Object;
var Void = (function (_super) {
    __extends(Void, _super);
    function Void() {
        _super.apply(this, arguments);
    }
    Void.prototype._type = function () {
        return 'void';
    };
    return Void;
}(TsType));
exports.Void = Void;
var Literal = (function (_super) {
    __extends(Literal, _super);
    function Literal(value) {
        _super.call(this);
        this.value = value;
    }
    Literal.prototype._type = function () {
        return this.value;
    };
    return Literal;
}(TsType));
exports.Literal = Literal;
var Array = (function (_super) {
    __extends(Array, _super);
    function Array(type) {
        _super.call(this);
        this.type = type;
    }
    Array.prototype._type = function (settings) {
        return (this.type || new Any()).toSafeType(settings) + "[]";
    };
    return Array;
}(TsType));
exports.Array = Array;
var Intersection = (function (_super) {
    __extends(Intersection, _super);
    function Intersection(data) {
        _super.call(this);
        this.data = data;
    }
    Intersection.prototype.isSimpleType = function () { return this.data.filter(function (_) { return !(_ instanceof Void); }).length <= 1; };
    Intersection.prototype._type = function (settings) {
        return this.data
            .filter(function (_) { return !(_ instanceof Void); })
            .map(function (_) { return _.toSafeType(settings); })
            .join('&');
    };
    Intersection.prototype.toSafeType = function (settings) {
        return "" + this.toType(settings);
    };
    return Intersection;
}(TsType));
exports.Intersection = Intersection;
var Union = (function (_super) {
    __extends(Union, _super);
    function Union() {
        _super.apply(this, arguments);
    }
    Union.prototype.isSimpleType = function () { return this.data.length <= 1; };
    Union.prototype._type = function (settings) {
        return this.data
            .map(function (_) { return _.toSafeType(settings); })
            .join('|');
    };
    return Union;
}(Intersection));
exports.Union = Union;
var Interface = (function (_super) {
    __extends(Interface, _super);
    function Interface(props) {
        _super.call(this);
        this.props = props;
    }
    Interface.reference = function (id) {
        var ret = new Interface([]);
        ret.id = id;
        return ret;
    };
    Interface.prototype._type = function (settings, declaration) {
        if (declaration === void 0) { declaration = false; }
        var id = this.safeId();
        return declaration || !id ? "{\n        " + this.props.map(function (_) {
            var decl = _.name;
            if (!_.required)
                decl += '?';
            decl += ": " + _.type.toType(settings);
            if (settings.endPropertyWithSemicolon)
                decl += ';';
            if (settings.propertyDescription && _.type.description)
                decl += ' // ' + _.type.description;
            return decl;
        }).join('\n') + "\n      }" : id;
    };
    Interface.prototype.isSimpleType = function () { return false; };
    Interface.prototype.toDeclaration = function (settings) {
        if (settings.useInterfaceDeclaration)
            return this.toBlockComment(settings) + "interface " + this.safeId() + " " + this._type(settings, true);
        else
            return this._toDeclaration("type " + this.safeId() + " = " + this._type(settings, true), settings);
    };
    return Interface;
}(TsType));
exports.Interface = Interface;
//# sourceMappingURL=TsTypes.js.map