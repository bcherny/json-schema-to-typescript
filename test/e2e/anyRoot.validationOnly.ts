// A root schema that only bounds values, without a type, is `unknown` like any other such schema
// (see anyForValidationOnlySchemas), declared under its name: `export type ValidationOnly = unknown`.
export const input = {
  title: 'ValidationOnly',
  description: 'At most 80 characters if a string; anything else goes',
  maxLength: 80,
  pattern: '^[^\\n]*$',
}
