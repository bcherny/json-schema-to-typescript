"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const pretty_printer_1 = require('./pretty-printer');
const TsType = require('./TsTypes');
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
    constructor(schema) {
        this.schema = schema;
        this.state = {
            interfaces: [],
            anonymousSchemaNameGenerator: this.generateSchemaName()
        };
    }
    toString() {
        return pretty_printer_1.format(this.state.interfaces
            .concat(this.toTsInterface(this.schema))
            .map(_ => _.toString())
            .join('\n'));
    }
    *generateSchemaName() {
        let counter = 0;
        while (++counter) {
            yield `Interface${counter}`;
        }
    }
    isRequired(propertyName, schema) {
        return schema.required.indexOf(propertyName) > -1;
    }
    supportsAdditionalProperties(schema) {
        return schema.additionalProperties === true || lodash_1.isPlainObject(schema.additionalProperties);
    }
    toInterfaceName(a) {
        return lodash_1.upperFirst(lodash_1.camelCase(a))
            || this.state.anonymousSchemaNameGenerator.next().value;
    }
    getRuleType(rule) {
        if (rule.type === 'array' && rule.items && rule.items.type) {
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
    parsePath(path) {
        return (path.slice(0, 2) === '#/' ? path.slice(2) : path).split('/');
    }
    getReference(path, root) {
        switch (path.length) {
            case 0: throw ReferenceError(`$ref "#{path.join('/')}" points at invalid reference`);
            case 1: return root[path[0]];
            default: return this.getReference(path.slice(1), root[path[0]]);
        }
    }
    getInterface(name) {
        return this.state.interfaces.find(_ => _.name === this.toInterfaceName(name));
    }
    createInterfaceNx(rule, name) {
        return this.getInterface(name) || (() => {
            const a = this.toTsInterface(rule, name);
            this.state.interfaces.push(a);
            return a;
        })();
    }
    toStringLiteral(a) {
        switch (typeof a) {
            case 'boolean': return 'boolean'; // ts doesn't support literal boolean types
            case 'number': return 'number'; // ts doesn't support literal numeric types
            case 'string': return `"${a}"`;
            default: return a;
        }
    }
    toTsType(rule, root, name) {
        switch (this.getRuleType(rule)) {
            case RuleType.AnonymousSchema:
                return new TsType.AnonymousInterface(this.schemaPropsToInterfaceProps(lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, {
                    required: Object.keys(rule),
                    properties: rule
                })));
            case RuleType.NamedSchema:
                return new TsType.NamedClass(this.createInterfaceNx(rule, name).name);
            case RuleType.Enum:
                return new TsType.Union(lodash_1.uniqBy(rule.enum.map(_ => this.toTsType(this.toStringLiteral(_), root)), _ => _.toString()));
            case RuleType.Any: return new TsType.Any;
            case RuleType.Literal: return new TsType.Literal(rule);
            case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items, root));
            case RuleType.Array: return new TsType.Array;
            case RuleType.Boolean: return new TsType.Boolean;
            case RuleType.Number: return new TsType.Number;
            case RuleType.Object: return new TsType.Object;
            case RuleType.String: return new TsType.String;
            case RuleType.Void: return new TsType.Void;
            case RuleType.AllOf:
                return new TsType.Intersection(rule.allOf.map(_ => {
                    const path = this.parsePath(_.$ref);
                    return this.toTsType(_, root, lodash_1.last(path));
                }));
            case RuleType.AnyOf:
                return new TsType.Union(rule.anyOf.map(_ => {
                    const path = this.parsePath(_.$ref);
                    return this.toTsType(_, root, lodash_1.last(path));
                }));
            case RuleType.Reference:
                const path = this.parsePath(rule.$ref);
                const int = this.getInterface(lodash_1.last(path));
                return int
                    ? new TsType.Literal(int.name)
                    : this.toTsType(this.getReference(path, root), root, lodash_1.last(path));
        }
    }
    schemaPropsToInterfaceProps(schema) {
        return lodash_1.map(schema.properties, (v, k) => new TsType.InterfaceProperty({
            isRequired: this.isRequired(k, schema),
            key: k,
            value: this.toTsType(v, schema),
            description: v.description
        }));
    }
    toTsInterface(schema, title) {
        schema = lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, schema);
        const props = this.schemaPropsToInterfaceProps(schema);
        if (this.supportsAdditionalProperties(schema)) {
            props.push(new TsType.InterfaceProperty({
                key: '[k: string]',
                isRequired: true,
                value: (schema.additionalProperties === true
                    ? new TsType.Any
                    : this.toTsType(schema.additionalProperties, schema))
            }));
        }
        return new TsType.Interface({
            name: this.toInterfaceName(title || schema.title),
            description: schema.description,
            props: props
        });
    }
}
Compiler.DEFAULT_SCHEMA = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
};
function compile(schema) {
    return new Compiler(schema).toString();
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