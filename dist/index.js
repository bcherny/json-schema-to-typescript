"use strict";
var lodash_1 = require('lodash');
var fs_1 = require('fs');
var JSONSchemaToTsTypeMap = {
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
    return "\n    interface " + schema.name + " {\n      " + lodash_1.map(schema.properties, function (v, k) {
        return ("" + k + (isRequired(k, schema) ? '' : '?') + ": " + JSONSchemaToTsTypeMap[v.type]);
    }).join('\n') + "\n    }\n  ";
}
exports.compile = compile;
function compileFromFile(inputFilename) {
    return fs_1.readFile(inputFilename, function (err, data) {
        var a = compile(JSON.parse(data));
        console.log(a);
        return a;
    });
}
exports.compileFromFile = compileFromFile;
//# sourceMappingURL=index.js.map