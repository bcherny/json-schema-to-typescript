import { camelCase, upperFirst } from 'lodash'

const multiLineCommentStart  = '/** '
const multiLineCommentIndent = ' *  '
const multiLineCommentEnd    = ' */'
const newLineRegex = /\\n|\n/

export namespace TsType {

  export interface TsTypeSettings {
    declarationDescription?: boolean
    // TODO declareProperties?: boolean
    declareReferenced?: boolean
    declareSimpleType?: boolean
    endPropertyWithSemicolon?: boolean
    endTypeWithSemicolon?: boolean
    propertyDescription?: boolean
    useConstEnums?: boolean
    useFullReferencePathAsName?: boolean
    useInterfaceDeclaration?: boolean
  }

  export var DEFAULT_SETTINGS: TsTypeSettings = {
    declarationDescription: true,
    // declareProperties: false,
    declareReferenced: true,
    declareSimpleType: false,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    propertyDescription: true,
    useConstEnums: true,
    useFullReferencePathAsName: false,
    useInterfaceDeclaration: true
  }

  export abstract class TsTypeBase {
    id?: string
    description?: string

    protected safeId() {
      return this.id && upperFirst(camelCase(this.id))
    }
    protected toBlockComment(settings: TsTypeSettings) {
      return this.description && settings.declarationDescription ?
        `${this.description
            .split(newLineRegex)
            .map((line, lineNum) => (lineNum > 0 ? multiLineCommentIndent : multiLineCommentStart) + line)
            .join('\n') + multiLineCommentEnd + '\n'
        }` :
        ''
    }
    protected _toDeclaration(decl: string, settings: TsTypeSettings): string {
      return this.toBlockComment(settings) + decl + (settings.endTypeWithSemicolon ? ';' : '')
    }
    protected abstract _type(settings: TsTypeSettings): string
    isSimpleType() { return true }
    toDeclaration(settings: TsTypeSettings): string {
      return this._toDeclaration(`export type ${this.safeId()} = ${this._type(settings)}`, settings)
    }
    toSafeType(settings: TsTypeSettings): string {
      return this.toType(settings)
    }
    toType(settings: TsTypeSettings): string {
      return this.safeId() || this._type(settings)
    }
    toString(): string {
      return this._type(DEFAULT_SETTINGS)
    }
  }

  export interface TsProp {
    name: string
    required: boolean
    type: TsTypeBase
  }

  export class Any extends TsTypeBase {
    _type() {
      return 'any'
    }
  }
  export class String extends TsTypeBase {
    _type() {
      return 'string'
    }
  }
  export class Boolean extends TsTypeBase {
    _type() {
      return 'boolean'
    }
  }
  export class Number extends TsTypeBase {
    _type() {
      return 'number'
    }
  }
  export class Object extends TsTypeBase {
    _type() {
      return 'Object'
    }
  }
  export class Void extends TsTypeBase {
    _type() {
      return 'void'
    }
  }
  export class Literal extends TsTypeBase {
    constructor(private value: any) { super() }
    _type() {
      return this.value
    }
  }

  export class EnumValue {
    identifier: string
    value: string

    constructor(enumValues: string[]) {
      this.identifier = enumValues[0]
      this.value = enumValues[1]
    }

    toDeclaration(){
      // if there is a value associated with the identifier, declare as identifier=value
      // else declare as identifier
      return `${this.identifier}${this.value ? ('=' + this.value) : ''}`
    }

    toString(){
      return `Enum${this.identifier}`
    }
  }

  export class Enum extends TsTypeBase {
    constructor(public enumValues: EnumValue[]) {
      super()
    }
    isSimpleType() { return false }
    _type(settings: TsTypeSettings) {
      return this.safeId() || 'SomeEnumType'
    }
    toSafeType(settings: TsTypeSettings) {
      return `${this.toType(settings)}`
    }
    toDeclaration(settings: TsTypeSettings): string {
      return `${this.toBlockComment(settings)}export ${settings.useConstEnums ? 'const ' : ''}enum ${this._type(settings)}{
        ${this.enumValues.map(_ => _.toDeclaration()).join(',\n')}
      }`
    }
  }

  export class Array extends TsTypeBase {
    constructor(private type?: TsTypeBase) { super() }
    _type(settings: TsTypeSettings) {
      return `${(this.type || new Any()).toSafeType(settings)}[]`
    }
  }
  export class Intersection extends TsTypeBase {
    constructor(protected data: TsTypeBase[]) {
      super()
    }
    isSimpleType() { return this.data.filter(_ => !(_ instanceof Void)).length <= 1 }
    _type(settings: TsTypeSettings) {
      return this.data
        .filter(_ => !(_ instanceof Void))
        .map(_ => _.toSafeType(settings))
        .join('&')
    }
    toSafeType(settings: TsTypeSettings) {
      return `${this.toType(settings)}`
    }
  }
  export class Union extends Intersection {
    isSimpleType() { return this.data.length <= 1 }
    _type(settings: TsTypeSettings) {
      return this.data
        .map(_ => _.toSafeType(settings))
        .join('|')
    }
  }

  export class Interface extends TsTypeBase {
    constructor(private props: TsProp[]) {
      super()
    }
    static reference(id: string) {
      let ret = new Interface([])
      ret.id = id
      return ret
    }
    protected _type(settings: TsTypeSettings, declaration: boolean = false) {
      let id = this.safeId()
      return declaration || !id ? `{
        ${this.props.map(_ => {
          const indentString =  '    '
          let decl = indentString + _.name

          if (!_.required)
            decl += '?'
          decl += ': ' + _.type.toType(settings)
          if (settings.endPropertyWithSemicolon)
            decl += ';'

          //Single line description in comment to the right of declaration
          //Multiple line description in comment above
          if (settings.propertyDescription && _.type.description && !_.type.id)
            decl = newLineRegex.test(_.type.description) ?
              _.type.description
                .split(newLineRegex)
                .map((line, lineNum) => indentString + (lineNum > 0 ? multiLineCommentIndent : multiLineCommentStart) + line)
                .join('\n') +
                '\n' + indentString + multiLineCommentEnd + '\n' + decl :
              decl + ' // ' + _.type.description

          return decl
        }).join('\n')}
}` : id
    }
    isSimpleType() { return false }
    toDeclaration(settings: TsTypeSettings): string {
      if (settings.useInterfaceDeclaration)
        return `${this.toBlockComment(settings)}export interface ${this.safeId()} ${this._type(settings, true)}`
      return this._toDeclaration(`export type ${this.safeId()} = ${this._type(settings, true)}`, settings)
    }
  }

}
