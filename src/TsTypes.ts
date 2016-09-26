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
    useFullReferencePathAsName: false
  }

  export abstract class TsTypeBase {
    id: string
    description?: string

    private generateComment(string: string): string {
      return string
        .split(newLineRegex)
        .map((line, lineNum) => (lineNum > 0 ? multiLineCommentIndent : multiLineCommentStart) + line)
        .join('\n') + multiLineCommentEnd + '\n'
    }

    protected safeId() {
      return nameToTsSafeName(this.id)
    }
    protected toBlockComment(settings: TsTypeSettings) {
      return this.description && settings.declarationDescription
        ? `${this.generateComment(this.description)}`
        : ''
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
  export class Null extends TsTypeBase {
    _type() {
      return 'null'
    }
  }
  export class Literal extends TsTypeBase {
    constructor(private value: any) { super() }
    _type() {
      return JSON.stringify(this.value)
    }
  }

  export class Reference extends TsTypeBase {
    constructor(private value: string) { super() }
    _type() { return this.value }
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
    constructor(public id: string, public enumValues: EnumValue[]) {
      super()
    }
    isSimpleType() { return false }
    _type(settings: TsTypeSettings): string {
      return this.safeId()
    }
    toSafeType(settings: TsTypeSettings) {
      return `${this.toType(settings)}`
    }
    toDeclaration(settings: TsTypeSettings): string {
      return `${this.toBlockComment(settings)}export ${settings.useConstEnums ? 'const ' : ''}enum ${this.safeId()}{
        ${this.enumValues.map(_ => _.toDeclaration()).join(',\n')}
      }`
    }
  }

  export class Array extends TsTypeBase {
    constructor(private type?: TsTypeBase) { super() }
    _type(settings: TsTypeSettings) {
      const type = (this.type || new Any()).toSafeType(settings)
      return `${type.indexOf('|') > -1 || type.indexOf('&') > -1 ? `(${type})` : type}[]` // hacky
    }
  }
  export class Intersection extends TsTypeBase {
    constructor(protected data: TsTypeBase[]) {
      super()
    }
    isSimpleType() { return this.data.filter(_ => !(_ instanceof Null)).length <= 1 }
    _type(settings: TsTypeSettings) {
      return this.data
        .filter(_ => !(_ instanceof Null))
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

          // All descriptions will be inside jsdoc-style comments to support hinting in editors
          // (eg. intellisense)
          if (settings.propertyDescription && _.type.description && !_.type.id)
            decl = _.type.description
                .split(newLineRegex)
                .map((line, lineNum) => (lineNum > 0 ? multiLineCommentIndent : indentString + multiLineCommentStart) + line)
                .join('\n' + indentString) + multiLineCommentEnd + '\n' + decl

          return decl
        }).join('\n')}
}` : id
    }
    isSimpleType() { return false }
    toDeclaration(settings: TsTypeSettings): string {
      return `${this.toBlockComment(settings)}export interface ${this.safeId()} ${this._type(settings, true)}`
    }
  }

}

// eg.
//   foo -> Foo
//   fooBar -> FooBar
//   foo_1bar -> Foo_1bar
// TODO: more safety
// TODO: unit tests
function nameToTsSafeName(name: string): string {
  return upperFirst(camelCase(name))
}
