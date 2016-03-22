"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
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
function compile(schema) {
    return `
    interface ${schema.title} {
      ${lodash_1.map(schema.properties, (v, k) => `${k}${isRequired(k, schema) ? '' : '?'}: ${JSONSchemaToTsTypeMap[v.type]}`).join('\n')}
    }
  `;
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