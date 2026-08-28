json-schema-to-typescript compiles files from JSONSchema to TypeScript in distinct phases:

#### 1. Validator

TODO use an external validation library

#### 2. Prenormalizer

Rewrites the few things that have to be seen on the raw document, before the dereferencer folds each `$ref`'s sibling keywords into a copy of its target (eg. `nullable` next to a `$ref`, or a root schema that is itself a `$ref`).

#### 3. Dereferencer

Resolves referenced schemas (in the file, on the local filesystem, or over the network). A document whose `$ref`s all point into itself is dereferenced in-process; anything else goes through [$RefParser](https://github.com/APIDevTools/json-schema-ref-parser), and the two give the same result (test/resolver.test.ts).

#### 4. Linker

Adds links back from each node in a schema to its parent (available via the `Parent` symbol on each node), for convenience.

#### 5. Normalizer

Normalizes input schemas so the parser can make more assumptions about schemas' properties and values.

#### 6. Parser

Parses JSONSchema to an intermediate representation for easy code generation.

#### 7. Optimizer

Optimizes the IR to produce concise and readable TypeScript in step (8).

#### 8. Generator

Converts the intermediate respresentation to TypeScript code.

#### 9. Formatter

Formats the code so it is properly indented, etc.

#### Compiling a set of files (`compileFiles`, `--imports`)

Each file goes through phases 1–7 on its own, with two additions: the dereferencer registers the file under its own path and stamps every node of every document it loads with the file and JSON Pointer it came from (`Source`, before any `$ref` is inlined; the parser copies it onto named AST nodes as `source`), and the other files of the set are served to it from memory. Then `src/modules.ts` runs the generator over every file twice: once to learn which of its own schemas each file declares and under what name, and once for real, with a linker that turns a named type owned by another file of the set into an `import type` instead of a declaration.

All phases share one table of the JSON-Schema keywords they tell apart, and what each one holds: `src/keywords.ts`.
