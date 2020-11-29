json-schema-to-typescript compiles files from JSONSchema to TypeScript in distinct phases:

#### 1. Validator

TODO use an external validation library

#### 2. Dereferencer

Resolves referenced schemas (in the file, on the local filesystem, or over the network).

#### 3. Linker

Adds links back from each node in a schema to its parent (available via the `Parent` symbol on each node), for convenience.

#### 4. Normalizer

Normalizes input schemas so the parser can make more assumptions about schemas' properties and values.

#### 5. Parser

Parses JSONSchema to an intermediate representation for easy code generation.

#### 6. Optimizer

Optimizes the IR to produce concise and readable TypeScript in step (6).

#### 7. Generator

Converts the intermediate respresentation to TypeScript code.

#### 8. Formatter

Formats the code so it is properly indented, etc.
