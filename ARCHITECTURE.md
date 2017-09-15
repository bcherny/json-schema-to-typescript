json-schema-to-typescript compiles files from JSONSchema to TypeScript in distinct phases:

#### 1. Validator

TODO use an external validation library

#### 2. Normalizer

Normalizes input schemas so the parser can make more assumptions about schemas' properties and values.

#### 3. Resolver

Resolves referenced schemas (in the file, on the local filesystem, or over the network).

#### 4. Parser

Parses JSONSchema to an intermediate representation for easy code generation.

#### 5. Optimizer

Optimizes the IR to produce concise and readable TypeScript in step (6).

#### 6. Generator

Converts the intermediate respresentation to TypeScript code.

#### 7. Formatter

Formats the code so it is properly indented, etc.
