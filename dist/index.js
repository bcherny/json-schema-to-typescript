"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const stream_1 = require('stream');
const pretty_printer_1 = require('./pretty-printer');
const JSONSchemaToTsTypeMap = {
    array: 'array',
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    null: 'void',
    object: 'Object',
    string: 'string'
};
function isRequired(propertyName, schema) {
    return schema.required.indexOf(propertyName) > -1;
}
function supportsAdditionalProperties(schema) {
    return !(schema.additionalProperties === false);
}
function toInterfaceName(a) {
    return lodash_1.upperFirst(lodash_1.camelCase(a));
}
function getType(prop) {
    if (prop.type === 'array' && prop.items && prop.items.type) {
        return `${JSONSchemaToTsTypeMap[prop.items.type]}[]`;
    }
    return JSONSchemaToTsTypeMap[prop.type];
}
const DEFAULT_SCHEMA = {
    properties: {},
    required: [],
    type: 'object'
};
function compile(schema) {
    schema = lodash_1.merge({}, DEFAULT_SCHEMA, schema);
    const props = lodash_1.map(schema.properties, (v, k) => `${k}${isRequired(k, schema) ? '' : '?'}: ${getType(v)};`
        + (v.description ? ` // ${v.description}` : ''));
    if (supportsAdditionalProperties(schema)) {
        props.push('[a: string]: any;');
    }
    const parts = [];
    if (schema.description) {
        parts.push(`/*
  ${schema.description}
*/`);
    }
    parts.push(`
    interface ${toInterfaceName(schema.title)} {
      ${props.join('\n')}
    }`);
    return pretty_printer_1.format(parts.join('\n'));
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