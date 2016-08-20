// from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#pretty-printer-using-the-ls-formatter
"use strict";
var ts = require("typescript");
function format(text) {
    var options = getDefaultOptions();
    // Parse the source text
    var sourceFile = ts.createSourceFile("file.ts", text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
    // Get the formatting edits on the input sources
    var edits = ts.formatting.formatDocument(sourceFile, getRuleProvider(options), options);
    // Apply the edits on the input code
    return applyEdits(text, edits);
    function getRuleProvider(options) {
        // Share this between multiple formatters using the same options.
        // This represents the bulk of the space the formatter uses.
        var ruleProvider = new ts.formatting.RulesProvider();
        ruleProvider.ensureUpToDate(options);
        return ruleProvider;
    }
    function applyEdits(text, edits) {
        // Apply edits in reverse on the existing text
        var result = text;
        for (var i = edits.length - 1; i >= 0; i--) {
            var change = edits[i];
            var head = result.slice(0, change.span.start);
            var tail = result.slice(change.span.start + change.span.length);
            result = head + change.newText + tail;
        }
        return result;
    }
    function getDefaultOptions() {
        return {
            IndentSize: 2,
            TabSize: 2,
            NewLineCharacter: '\n',
            ConvertTabsToSpaces: true,
            IndentStyle: ts.IndentStyle.Smart,
            InsertSpaceAfterCommaDelimiter: true,
            InsertSpaceAfterSemicolonInForStatements: true,
            InsertSpaceBeforeAndAfterBinaryOperators: true,
            InsertSpaceAfterKeywordsInControlFlowStatements: true,
            InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
            InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
            PlaceOpenBraceOnNewLineForFunctions: false,
            PlaceOpenBraceOnNewLineForControlBlocks: false
        };
    }
}
exports.format = format;
//# sourceMappingURL=pretty-printer.js.map