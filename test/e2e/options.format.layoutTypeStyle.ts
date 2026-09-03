// The unformatted layout under the options that change how declarations are written: type
// aliases instead of interfaces, `| undefined` on optional properties, `readonly` members and
// arrays, plain enums.
export {input} from './options.format.layout'

export const options = {
  format: false,
  declarationStyle: 'type',
  undefinedOptionalProperties: true,
  readonly: true,
  enableConstEnums: false,
  strictIndexSignatures: true,
}
