// A root schema made of an applicator this tool does not implement, and nothing that shapes a
// type, is `unknown` (see anyForUnimplementedApplicators.ts), declared under its name.
export const input = {
  title: 'NotOnly',
  description: 'Anything but the empty string',
  not: {enum: ['']},
}
