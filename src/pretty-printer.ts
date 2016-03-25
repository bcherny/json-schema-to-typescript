// from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#pretty-printer-using-the-ls-formatter

import * as ts from "typescript";

// Note: this uses ts.formatting which is part of the typescript 1.4 package but is not currently 
//       exposed in the public typescript.d.ts. The typings should be exposed in the next release. 
export function format(text: string) {
  let options = getDefaultOptions();

  // Parse the source text
  let sourceFile = ts.createSourceFile("file.ts", text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);

  // Get the formatting edits on the input sources
  let edits = (<any>ts).formatting.formatDocument(sourceFile, getRuleProvider(options), options);

  // Apply the edits on the input code
  return applyEdits(text, edits);

  function getRuleProvider(options: ts.FormatCodeOptions) {
    // Share this between multiple formatters using the same options.
    // This represents the bulk of the space the formatter uses.
    let ruleProvider = new (<any>ts).formatting.RulesProvider();
    ruleProvider.ensureUpToDate(options);
    return ruleProvider;
  }

  function applyEdits(text: string, edits: ts.TextChange[]): string {
    // Apply edits in reverse on the existing text
    let result = text;
    for (let i = edits.length - 1; i >= 0; i--) {
      let change = edits[i];
      let head = result.slice(0, change.span.start);
      let tail = result.slice(change.span.start + change.span.length)
      result = head + change.newText + tail;
    }
    return result;
  }

  function getDefaultOptions(): ts.FormatCodeOptions {
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