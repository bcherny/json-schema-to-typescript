"use strict";
const lodash_1 = require('lodash');
const fs_1 = require('fs');
const tsfmt = require('typescript-formatter');
const stream_1 = require('stream');
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
function toInterfaceName(a) {
    return lodash_1.upperFirst(lodash_1.camelCase(a));
}
const ESFORMATTER_OPTIONS = {
    indent: {
        value: '  '
    }
};
function compile(schema) {
    const s = streamFromString(`
		interface ${toInterfaceName(schema.title)} {
			${lodash_1.map(schema.properties, (v, k) => `${k}${isRequired(k, schema) ? '' : '?'}: ${JSONSchemaToTsTypeMap[v.type]};`
        + (v.description ? ` // ${v.description}` : '')).join('\n')}
		}
	`);
    return tsfmt.processStream('./tmp.ts', s, {
        dryRun: true,
        replace: false,
        verify: false,
        tsconfig: false,
        tslint: false,
        editorconfig: false,
        tsfmt: true
    })
        .then(_ => _.dest);
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