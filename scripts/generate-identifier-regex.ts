// Original author: https://gist.github.com/mathiasbynens
// Source: https://gist.github.com/mathiasbynens/6334847

// Note: run `npm install` first!
'use strict';

const fs = require('fs');

const regenerate = require('regenerate');
const template = require('lodash.template');

// Which Unicode version should be used?
const version = '11.0.0';

// Set up a shorthand function to import Unicode data.
const get = function(what: string) {
	return require(`unicode-${ version }/${ what }/code-points.js`);
};

// Get the Unicode categories needed to construct the ES5 regex.
const Lu = get('General_Category/Uppercase_Letter');
const Ll = get('General_Category/Lowercase_Letter');
const Lt = get('General_Category/Titlecase_Letter');
const Lm = get('General_Category/Modifier_Letter');
const Lo = get('General_Category/Other_Letter');
const Nl = get('General_Category/Letter_Number');
const Mn = get('General_Category/Nonspacing_Mark');
const Mc = get('General_Category/Spacing_Mark');
const Nd = get('General_Category/Decimal_Number');
const Pc = get('General_Category/Connector_Punctuation');

// Get the Unicode properties needed to construct the ES6 regex.
const ID_Start = get('Binary_Property/ID_Start');
const ID_Continue = get('Binary_Property/ID_Continue');
const Other_ID_Start = get('Binary_Property/Other_ID_Start');

const compileRegex = template('/^(?!(?:<%= reservedWords %>)$)' +
	'(?:<%= identifierStart %>)(?:<%= identifierPart %>)*$/');

const generateES5Regex = function(): [string, string, string] { // ES 5.1
	// https://mathiasbynens.be/notes/javascript-identifiers#valid-identifier-names
	const identifierStart = regenerate('$', '_')
		.add(Lu, Ll, Lt, Lm, Lo, Nl)
		.removeRange(0x010000, 0x10FFFF); // Remove astral symbols.
	const identifierPart = identifierStart.clone()
		.add('\u200C', '\u200D', Mn, Mc, Nd, Pc)
		.removeRange(0x010000, 0x10FFFF); // Remove astral symbols.

	const reservedWords = [
		// https://mathiasbynens.be/notes/reserved-keywords#ecmascript-5
		'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else',
		'enum', 'eval', 'null', 'this', 'true', 'void', 'with', 'break', 'catch',
		'class', 'const', 'false', 'super', 'throw', 'while', 'yield', 'delete',
		'export', 'import', 'public', 'return', 'static', 'switch', 'typeof',
		'default', 'extends', 'finally', 'package', 'private', 'continue',
		'debugger', 'function', 'arguments', 'interface', 'protected',
		'implements', 'instanceof',
		// These aren’t strictly reserved words, but they kind of behave as if
		// they were.
		//'NaN', 'Infinity', 'undefined'
	];

	const entireIdentifierRegex = compileRegex({
		'reservedWords': reservedWords.join('|'),
		'identifierStart': identifierStart.toString(),
		'identifierPart': identifierPart.toString()
	});

	const invalidPart = regenerate()
		// Add all Unicode codepoints
		.addRange(0x000000, 0x10FFFF)
		.remove(identifierPart);

	const startingRegex = `/${ identifierStart.toString() }/`;
	const invalidPartRegex = `/${ invalidPart.toString() }/g`;

	return [
		entireIdentifierRegex,
		startingRegex,
		invalidPartRegex
	];
};

const generateES6Regex = function() {
	// http://ecma-international.org/ecma-262/6.0/#sec-identifier-names-static-semantics-early-errors
	// http://unicode.org/reports/tr31/#Default_Identifier_Syntax
	// https://bugs.ecmascript.org/show_bug.cgi?id=2717#c0
	const identifierStart = regenerate(ID_Start)
		// Note: this already includes `Other_ID_Start`. http://git.io/wRCAfQ
		.add(
			'$',
			'_'
		);
	const identifierPart = regenerate(ID_Continue)
		// Note: `ID_Continue` already includes `Other_ID_Continue`. http://git.io/wRCAfQ
		.add(Other_ID_Start)
		.add(
			'$',
			'_',
			'\u200C',
			'\u200D'
		);

	const reservedWords = [
		// https://mathiasbynens.be/notes/reserved-keywords#ecmascript-6
		'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else',
		'enum', 'eval', 'null', 'this', 'true', 'void', 'with', 'await', 'break',
		'catch', 'class', 'const', 'false', 'super', 'throw', 'while', 'yield',
		'delete', 'export', 'import', 'public', 'return', 'static', 'switch',
		'typeof', 'default', 'extends', 'finally', 'package', 'private',
		'continue', 'debugger', 'function', 'arguments', 'interface', 'protected',
		'implements', 'instanceof',
		// These aren’t strictly reserved words, but they kind of behave as if
		// they were.
		//'NaN', 'Infinity', 'undefined'
	];

	const regex = compileRegex({
		'reservedWords': reservedWords.join('|'),
		'identifierStart': identifierStart.toString(),
		'identifierPart': identifierPart.toString()
	});
	return regex;
};

function generateRegexFileContents(entireIdentifierRegex: string, startingRegex: string, invalidPartRegex: string) {
	return `export const entireIdentifier = ${ entireIdentifierRegex };\n`
		+ `export const startingRegex = ${ startingRegex };\n`
		+ `export const invalidPartRegex = ${ invalidPartRegex };\n`
}

fs.writeFileSync(
	'../src/resources/es5IdentifierRegex.ts',
	"// ECMAScript 5.1:\n\n" + generateRegexFileContents(...generateES5Regex())
);
// fs.writeFileSync(
// 	'ecmascript-6.js',
// 	`// ECMAScript 6:\n\n${ generateES6Regex() }\n`
// );