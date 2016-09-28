import { camelCase, upperFirst } from 'lodash'

const COMMENT_START  = '/**'
const COMMENT_INDENT = ' * '
const COMMENT_END    = ' */'
const INDENT_STRING  = '  '

export namespace TsType {

  export interface TsTypeSettings {
    declareReferenced?: boolean
    declareSimpleType?: boolean
    endPropertyWithSemicolon?: boolean
    endTypeWithSemicolon?: boolean
    useConstEnums?: boolean
    useFullReferencePathAsName?: boolean
  }

  export const DEFAULT_SETTINGS: TsTypeSettings = {
    declareReferenced: true,
    declareSimpleType: false,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    useConstEnums: true,
    useFullReferencePathAsName: false
  }

  export abstract class TsTypeBase {
    id: string
    description?: string

    protected generateComment(string: string): string[] {
      return [
        COMMENT_START,
        ...string.split('\n').map(_ => COMMENT_INDENT + _),
        COMMENT_END
      ]
    }

    protected safeId() {
      return nameToTsSafeName(this.id)
    }
    protected toBlockComment(settings: TsTypeSettings) {
      return this.description && !this.isSimpleType()
        ? `${this.generateComment(this.description).join('\n')}\n`
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
      return `${this.identifier}${this.value ? (' = ' + this.value) : ''}`
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
    toDeclaration(settings: TsTypeSettings): string {
      return this.toBlockComment(settings)
        + `export ${settings.useConstEnums ? 'const ' : ''}enum ${this.safeId()} {`
        + '\n'
        + INDENT_STRING
        + this.enumValues.map(_ => _.toDeclaration()).join(`,\n${INDENT_STRING}`)
        + '\n'
        + '}'
    }
  }

  export class Array extends TsTypeBase {
    constructor(private type?: TsTypeBase) { super() }
    _type(settings: TsTypeSettings) {
      const type = (this.type || new Any()).toType(settings)
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
        .map(_ => _.toType(settings))
        .join(' & ')
    }
  }
  export class Union extends Intersection {
    isSimpleType() { return this.data.length <= 1 }
    _type(settings: TsTypeSettings) {
      return this.data
        .map(_ => _.toType(settings))
        .join(' | ')
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
    protected _type(settings: TsTypeSettings) {
      return `{\n`
        + `${this.props.map(_ =>
        `${INDENT_STRING}${_.type.description
          ? this.generateComment(_.type.description).join(`\n${INDENT_STRING}`) + `\n${INDENT_STRING}`
          : ''
        }${_.name}${_.required ? '' : '?'}: ${
          _.type.toType(settings).replace(/\n/g, '\n' + INDENT_STRING) // ghetto nested indents
        }${
          settings.endPropertyWithSemicolon ? ';' : ''
        }`
        ).join('\n')}
}`
    }
    isSimpleType() { return false }
    toDeclaration(settings: TsTypeSettings): string {
      return `${this.toBlockComment(settings)}export interface ${this.safeId()} ${this._type(settings)}`
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
