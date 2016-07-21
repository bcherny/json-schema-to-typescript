"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const pretty_printer_1 = require('./pretty-printer');
const TsType = require('./TsTypes');
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
class Compiler {
    constructor(schema, settings) {
        this.schema = schema;
        this.id = schema.id || schema.title || "Interface1";
        this.declarations = new Map();
        this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings);
        let decl = this.declareType(this.toTsType(this.schema), this.id, this.id);
    }
    toString() {
        return pretty_printer_1.format(Array.from(this.declarations.values())
            .map(_ => _.toDeclaration(this.settings))
            .join('\n'));
    }
    isRequired(propertyName, schema) {
        return schema.required ? schema.required.indexOf(propertyName) > -1 : false;
    }
    supportsAdditionalProperties(schema) {
        return schema.additionalProperties === true || lodash_1.isPlainObject(schema.additionalProperties);
    }
    toDeclarationName(a) {
        return lodash_1.upperFirst(lodash_1.camelCase(a));
    }
    getRuleType(rule) {
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
    }
    isNumberLiteral(a) {
        return /^[\d\.]+$/.test(a);
    }
    // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
    resolveType(path) {
        if (path[0] !== '#')
            throw new Error("reference must start with #");
        if (path === '#' || path === '#/')
            return TsType.Interface.reference(this.id);
        const parts = path.slice(2).split('/');
        let ret = this.settings.declareReferenced ? this.declarations.get(parts.join('/')) : undefined;
        if (!ret) {
            let cur = this.schema;
            let i = 0;
            for (let i = 0; cur && i < parts.length; ++i) {
                cur = cur[parts[i]];
            }
            ret = this.toTsType(cur);
            if (this.settings.declareReferenced && (this.settings.declareSimpleType || !ret.isSimpleType()))
                this.declareType(ret, parts.join('/'), this.settings.useFullReferencePathAsName ? parts.join('/') : lodash_1.last(parts));
        }
        return ret;
    }
    declareType(type, path, id) {
        type.id = id;
        this.declarations.set(path, type);
        return type;
    }
    toStringLiteral(a) {
        switch (typeof a) {
            case 'boolean': return new TsType.Boolean; // ts doesn't support literal boolean types
            case 'number': return new TsType.Number; // ts doesn't support literal numeric types
            case 'string': return new TsType.Literal(JSON.stringify(a));
            default: return new TsType.Interface(lodash_1.map(a, (v, k) => {
                return {
                    type: this.toStringLiteral(v),
                    name: k,
                    required: true
                };
            }));
        }
    }
    createTsType(rule) {
        switch (this.getRuleType(rule)) {
            case RuleType.AnonymousSchema:
            case RuleType.NamedSchema:
                return this.toTsDeclaration(rule);
            case RuleType.Enum:
                return new TsType.Union(lodash_1.uniqBy(rule.enum.map(_ => this.toStringLiteral(_)), _ => _.toType(this.settings)));
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
                return new TsType.Intersection(rule.allOf.map(_ => this.toTsType(_)));
            case RuleType.AnyOf:
                return new TsType.Union(rule.anyOf.map(_ => this.toTsType(_)));
            case RuleType.Reference:
                return this.resolveType(rule.$ref);
        }
        throw "bug";
    }
    toTsType(rule) {
        let type = this.createTsType(rule);
        type.id = type.id || rule.id || rule.title;
        type.description = type.description || rule.description;
        return type;
    }
    toTsDeclaration(schema) {
        let copy = lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, schema);
        let set = new Set();
        let props = lodash_1.map(copy.properties, (v, k) => {
            return {
                type: this.toTsType(v),
                name: k,
                required: this.isRequired(k, copy)
            };
        });
        if (props.length === 0 && !("additionalProperties" in schema)) {
            if ("default" in schema)
                return new TsType.Void;
        }
        if (this.supportsAdditionalProperties(copy)) {
            let short = copy.additionalProperties === true;
            if (short && props.length === 0)
                return new TsType.Any;
            let type = short ? new TsType.Any : this.toTsType(copy.additionalProperties);
            props.push({
                type: type,
                name: '[k: string]',
                required: true
            });
        }
        return new TsType.Interface(props);
    }
}
Compiler.DEFAULT_SETTINGS = TsType.DEFAULT_SETTINGS;
Compiler.DEFAULT_SCHEMA = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
};
function compile(schema, settings) {
    return new Compiler(schema, settings).toString();
}
exports.compile = compile;
function compileFromFile(inputFilename) {
    return new Promise((resolve, reject) => fs_1.readFile(inputFilename, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(compile(JSON.parse(data.toString())));
        }
    }));
}
exports.compileFromFile = compileFromFile;
//# sourceMappingURL=index.js.map