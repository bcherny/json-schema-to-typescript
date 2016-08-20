"use strict";
var lodash_1 = require('lodash');
var fs_1 = require('fs');
var pretty_printer_1 = require('./pretty-printer');
var TsType = require('./TsTypes');
process.platform;
var RuleType;
(function (RuleType) {
    RuleType[RuleType["Any"] = 0] = "Any";
    RuleType[RuleType["TypedArray"] = 1] = "TypedArray";
    RuleType[RuleType["Enum"] = 2] = "Enum";
    RuleType[RuleType["AllOf"] = 3] = "AllOf";
    RuleType[RuleType["AnyOf"] = 4] = "AnyOf";
    RuleType[RuleType["Reference"] = 5] = "Reference";
    RuleType[RuleType["NamedSchema"] = 6] = "NamedSchema";
    RuleType[RuleType["AnonymousSchema"] = 7] = "AnonymousSchema";
    RuleType[RuleType["String"] = 8] = "String";
    RuleType[RuleType["Number"] = 9] = "Number";
    RuleType[RuleType["Void"] = 10] = "Void";
    RuleType[RuleType["Object"] = 11] = "Object";
    RuleType[RuleType["Array"] = 12] = "Array";
    RuleType[RuleType["Boolean"] = 13] = "Boolean";
    RuleType[RuleType["Literal"] = 14] = "Literal";
})(RuleType || (RuleType = {}));
var Compiler = (function () {
    function Compiler(schema, settings) {
        this.schema = schema;
        this.id = schema.id || schema.title || "Interface1";
        this.declarations = new Map();
        this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings);
        var decl = this.declareType(this.toTsType(this.schema), this.id, this.id);
    }
    Compiler.prototype.toString = function () {
        var _this = this;
        return pretty_printer_1.format(Array.from(this.declarations.values())
            .map(function (_) { return _.toDeclaration(_this.settings); })
            .join('\n'));
    };
    Compiler.prototype.isRequired = function (propertyName, schema) {
        return schema.required ? schema.required.indexOf(propertyName) > -1 : false;
    };
    Compiler.prototype.supportsAdditionalProperties = function (schema) {
        return schema.additionalProperties === true || lodash_1.isPlainObject(schema.additionalProperties);
    };
    Compiler.prototype.toDeclarationName = function (a) {
        return lodash_1.upperFirst(lodash_1.camelCase(a));
    };
    Compiler.prototype.getRuleType = function (rule) {
        if (rule.type === 'array' && rule.items) {
            return RuleType.TypedArray;
        }
        if (rule.enum) {
            return RuleType.Enum;
        }
        if (rule.properties || rule.additionalProperties) {
            return RuleType.NamedSchema;
        }
        if (rule.allOf) {
            return RuleType.AllOf;
        }
        if (rule.anyOf) {
            return RuleType.AnyOf;
        }
        if (rule.$ref) {
            return RuleType.Reference;
        }
        switch (rule.type) {
            case 'array': return RuleType.Array;
            case 'boolean': return RuleType.Boolean;
            case 'integer':
            case 'number': return RuleType.Number;
            case 'null': return RuleType.Void;
            case 'object': return RuleType.Object;
            case 'string': return RuleType.String;
        }
        if (this.isNumberLiteral(rule)) {
            return RuleType.Number;
        }
        if (!lodash_1.isPlainObject(rule)) {
            return RuleType.Literal;
        }
        if (lodash_1.isPlainObject(rule)) {
            return RuleType.AnonymousSchema; // TODO: is it safe to do this as a catchall?
        }
        return RuleType.Any;
    };
    Compiler.prototype.isNumberLiteral = function (a) {
        return /^[\d\.]+$/.test(a);
    };
    // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
    Compiler.prototype.resolveType = function (path) {
        if (path[0] !== '#')
            throw new Error("reference must start with #");
        if (path === '#' || path === '#/')
            return TsType.Interface.reference(this.id);
        var parts = path.slice(2).split('/');
        var ret = this.settings.declareReferenced ? this.declarations.get(parts.join('/')) : undefined;
        if (!ret) {
            var cur = this.schema;
            var i = 0;
            for (var i_1 = 0; cur && i_1 < parts.length; ++i_1) {
                cur = cur[parts[i_1]];
            }
            ret = this.toTsType(cur);
            if (this.settings.declareReferenced && (this.settings.declareSimpleType || !ret.isSimpleType()))
                this.declareType(ret, parts.join('/'), this.settings.useFullReferencePathAsName ? parts.join('/') : lodash_1.last(parts));
        }
        return ret;
    };
    Compiler.prototype.declareType = function (type, path, id) {
        type.id = id;
        this.declarations.set(path, type);
        return type;
    };
    Compiler.prototype.toStringLiteral = function (a) {
        var _this = this;
        switch (typeof a) {
            case 'boolean': return new TsType.Boolean; // ts doesn't support literal boolean types
            case 'number': return new TsType.Number; // ts doesn't support literal numeric types
            case 'string': return new TsType.Literal(JSON.stringify(a));
            default: return new TsType.Interface(lodash_1.map(a, function (v, k) {
                return {
                    type: _this.toStringLiteral(v),
                    name: k,
                    required: true
                };
            }));
        }
    };
    Compiler.prototype.createTsType = function (rule) {
        var _this = this;
        switch (this.getRuleType(rule)) {
            case RuleType.AnonymousSchema:
            case RuleType.NamedSchema:
                return this.toTsDeclaration(rule);
            case RuleType.Enum:
                return new TsType.Union(lodash_1.uniqBy(rule.enum.map(function (_) { return _this.toStringLiteral(_); }), function (_) { return _.toType(_this.settings); }));
            case RuleType.Any: return new TsType.Any;
            case RuleType.Literal: return new TsType.Literal(rule);
            case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items));
            case RuleType.Array: return new TsType.Array;
            case RuleType.Boolean: return new TsType.Boolean;
            case RuleType.Number: return new TsType.Number;
            case RuleType.Object: return new TsType.Object;
            case RuleType.String: return new TsType.String;
            case RuleType.Void: return new TsType.Void;
            case RuleType.AllOf:
                return new TsType.Intersection(rule.allOf.map(function (_) { return _this.toTsType(_); }));
            case RuleType.AnyOf:
                return new TsType.Union(rule.anyOf.map(function (_) { return _this.toTsType(_); }));
            case RuleType.Reference:
                return this.resolveType(rule.$ref);
        }
        throw "bug";
    };
    Compiler.prototype.toTsType = function (rule) {
        var type = this.createTsType(rule);
        type.id = type.id || rule.id || rule.title;
        type.description = type.description || rule.description;
        return type;
    };
    Compiler.prototype.toTsDeclaration = function (schema) {
        var _this = this;
        var copy = lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, schema);
        var set = new Set();
        var props = lodash_1.map(copy.properties, function (v, k) {
            return {
                type: _this.toTsType(v),
                name: k,
                required: _this.isRequired(k, copy)
            };
        });
        if (props.length === 0 && !("additionalProperties" in schema)) {
            if ("default" in schema)
                return new TsType.Void;
        }
        if (this.supportsAdditionalProperties(copy)) {
            var short = copy.additionalProperties === true;
            if (short && props.length === 0)
                return new TsType.Any;
            var type = short ? new TsType.Any : this.toTsType(copy.additionalProperties);
            props.push({
                type: type,
                name: '[k: string]',
                required: true
            });
        }
        return new TsType.Interface(props);
    };
    Compiler.DEFAULT_SETTINGS = TsType.DEFAULT_SETTINGS;
    Compiler.DEFAULT_SCHEMA = {
        additionalProperties: true,
        properties: {},
        required: [],
        type: 'object'
    };
    return Compiler;
}());
function compile(schema, settings) {
    return new Compiler(schema, settings).toString();
}
exports.compile = compile;
function compileFromFile(inputFilename) {
    return new Promise(function (resolve, reject) {
        return fs_1.readFile(inputFilename, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(compile(JSON.parse(data.toString())));
            }
        });
    });
}
exports.compileFromFile = compileFromFile;
//# sourceMappingURL=index.js.map