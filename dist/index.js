"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const stream_1 = require('stream');
const pretty_printer_1 = require('./pretty-printer');
var RuleType;
(function (RuleType) {
    RuleType[RuleType["TypedArray"] = 0] = "TypedArray";
    RuleType[RuleType["Enum"] = 1] = "Enum";
    RuleType[RuleType["Default"] = 2] = "Default";
    RuleType[RuleType["OneOf"] = 3] = "OneOf";
    RuleType[RuleType["Reference"] = 4] = "Reference";
    RuleType[RuleType["Schema"] = 5] = "Schema";
})(RuleType || (RuleType = {}));
class Compiler {
    constructor(schema) {
        this.schema = schema;
        this.state = {
            interfaces: []
        };
    }
    isRequired(propertyName, schema) {
        return schema.required.indexOf(propertyName) > -1;
    }
    supportsAdditionalProperties(schema) {
        return !(schema.additionalProperties === false);
    }
    toInterfaceName(a) {
        return lodash_1.upperFirst(lodash_1.camelCase(a));
    }
    getRuleType(rule) {
        if (rule.type === 'array' && rule.items && rule.items.type) {
            return RuleType.TypedArray;
        }
        if (rule.enum) {
            return RuleType.Enum;
        }
        if (rule.properties) {
            return RuleType.Schema;
        }
        if (rule.oneOf) {
            return RuleType.OneOf;
        }
        if (rule.$ref) {
            return RuleType.Reference;
        }
        return RuleType.Default;
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
    generateTypeString(rule, root, name) {
        let def, path;
        switch (this.getRuleType(rule)) {
            case RuleType.Schema:
                def = this.getInterface(name);
                if (def) {
                    return name;
                }
                else {
                    this.state.interfaces.push(this.generateInterface(rule, name));
                }
                return name;
            case RuleType.Default: return Compiler.JSON_SCHEMA_TO_TYPE_MAP[rule.type];
            case RuleType.Enum: return rule.enum.map(_ => `"${_}"`).join('|');
            case RuleType.TypedArray: return `${Compiler.JSON_SCHEMA_TO_TYPE_MAP[rule.items.type]}[]`;
            case RuleType.OneOf:
                return rule.oneOf.map(_ => {
                    const path = this.parsePath(_.$ref);
                    return this.toInterfaceName(this.generateTypeString(_, root, lodash_1.last(path)));
                }).join('|');
            case RuleType.Reference:
                path = this.parsePath(rule.$ref);
                def = this.getInterface(lodash_1.last(path));
                if (def) {
                    return def.name;
                }
                else {
                    return this.generateTypeString(this.getReference(path, root), root, lodash_1.last(path));
                }
        }
    }
    generateInterface(schema, title) {
        schema = lodash_1.merge({}, Compiler.DEFAULT_SCHEMA, schema);
        const props = lodash_1.map(schema.properties, (v, k) => `${k}${this.isRequired(k, schema) ? '' : '?'}: ${this.generateTypeString(v, schema)};`
            + (v.description ? ` // ${v.description}` : ''));
        if (this.supportsAdditionalProperties(schema)) {
            // TODO: dynamically generate key name to avoid collisions
            props.push('[k: string]: any;');
        }
        const parts = [];
        if (schema.description) {
            parts.push(`/*
    ${schema.description}
  */`);
        }
        const name = this.toInterfaceName(title || schema.title);
        parts.push(`interface ${name} {
      ${props.join('\n')}
    }`);
        return {
            name: name,
            code: parts.join('\n')
        };
    }
    toString() {
        const a = this.generateInterface(this.schema);
        this.state.interfaces.push(a);
        return pretty_printer_1.format(this.state.interfaces.map(_ => _.code).join('\n'));
    }
}
Compiler.DEFAULT_SCHEMA = {
    properties: {},
    required: [],
    type: 'object'
};
Compiler.JSON_SCHEMA_TO_TYPE_MAP = {
    array: 'array',
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    null: 'void',
    object: 'Object',
    string: 'string'
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
function streamFromString(string) {
    var s = new stream_1.Readable();
    s._read = function noop() { };
    s.push(string);
    s.push(null);
    return s;
}
//# sourceMappingURL=index.js.map