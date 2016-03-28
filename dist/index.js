"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const pretty_printer_1 = require('./pretty-printer');
const TsType = require('./TsTypes');
var RuleType;
(function (RuleType) {
    RuleType[RuleType["TypedArray"] = 0] = "TypedArray";
    RuleType[RuleType["Enum"] = 1] = "Enum";
    RuleType[RuleType["AllOf"] = 2] = "AllOf";
    RuleType[RuleType["AnyOf"] = 3] = "AnyOf";
    RuleType[RuleType["Reference"] = 4] = "Reference";
    RuleType[RuleType["Schema"] = 5] = "Schema";
    RuleType[RuleType["String"] = 6] = "String";
    RuleType[RuleType["Number"] = 7] = "Number";
    RuleType[RuleType["Void"] = 8] = "Void";
    RuleType[RuleType["Object"] = 9] = "Object";
    RuleType[RuleType["Array"] = 10] = "Array";
    RuleType[RuleType["Boolean"] = 11] = "Boolean";
    RuleType[RuleType["Literal"] = 12] = "Literal";
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
        if (!lodash_1.isPlainObject(rule)) {
            return RuleType.Literal;
        }
        if (rule.type === 'array' && rule.items && rule.items.type) {
            return RuleType.TypedArray;
        }
        if (rule.enum) {
            return RuleType.Enum;
        }
        if (rule.properties || rule.additionalProperties) {
            return RuleType.Schema;
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
        return RuleType.Literal; // TODO: is it safe to do this as a catchall?
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
            case 'boolean': return a ? 'true' : 'false';
            case 'number': return String(a);
            case 'string': return `"${a}"`;
            default: return JSON.stringify(a);
        }
    }
    toTsType(rule, root, name) {
        switch (this.getRuleType(rule)) {
            case RuleType.Schema:
                return new TsType.Class(this.createInterfaceNx(rule, name).name);
            case RuleType.Enum:
                return new TsType.Union(rule.enum.map(_ => this.toTsType(this.toStringLiteral(_), root)));
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
    toTsInterface(schema, title) {
        schema = lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, schema);
        const props = lodash_1.map(schema.properties, (v, k) => new TsType.InterfaceProperty({
            isRequired: this.isRequired(k, schema),
            key: k,
            value: this.toTsType(v, schema),
            description: v.description
        }));
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