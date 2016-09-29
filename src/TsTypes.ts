import { camelCase, upperFirst } from 'lodash'

const COMMENT_START  = '/**'
const COMMENT_INDENT = ' * '
const COMMENT_END    = ' */'
const INDENT_STRING  = '  '

export namespace TsType {

  export interface TsTypeSettings {
    declareReferenced?: boolean
    endPropertyWithSemicolon?: boolean
    endTypeWithSemicolon?: boolean
    useConstEnums?: boolean
    useFullReferencePathAsName?: boolean
  }

  export const DEFAULT_SETTINGS: TsTypeSettings = {
    declareReferenced: true,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    useConstEnums: true,
    useFullReferencePathAsName: false
  }

  export abstract class TsTypeBase<T> {
    id: string
    description?: string

    constructor(protected value: T) {}

    protected safeId() {
      return nameToTsSafeName(this.id)
    }
    protected toBlockComment(settings: TsTypeSettings) {
      return this.description && !this.isSimpleType()
        ? `${generateComment(this.description).join('\n')}\n`
        : ''
    }
    isSimpleType() { return true }
    toDeclaration(settings: TsTypeSettings): string {
      return this.toBlockComment(settings)
        + `export type ${this.safeId()} = ${this.toString(settings)}`
        + (settings.endTypeWithSemicolon ? ';' : '')
    }
    toType(settings: TsTypeSettings): string {
      return this.safeId() || this.toString(settings)
    }
    abstract toString(settings: TsTypeSettings): string
  }

  export interface TsProp<T> {
    name: string
    required: boolean
    type: TsTypeBase<T>
  }

  export class Any extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'any'
    }
  }
  export class String extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'string'
    }
  }
  export class Boolean extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'boolean'
    }
  }
  export class Number extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'number'
    }
  }
  export class Object extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'Object'
    }
  }
  export class Null extends TsTypeBase<void> {
    constructor() { super(undefined) }
    toString() {
      return 'null'
    }
  }
  export class Literal<T> extends TsTypeBase<T> {
    toString() {
      return JSON.stringify(this.value)
    }
  }

  export class Reference extends TsTypeBase<string> {
    toString() { return this.value }
  }

  export class EnumValue extends TsTypeBase<string> {
    identifier: string
    value: string

    constructor([identifier, value]: string[]) {
      super(value)
      this.identifier = identifier
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

  export class Enum extends TsTypeBase<EnumValue[]> {
    constructor(public id: string, value: EnumValue[]) {
      super(value)
    }
    isSimpleType() { return false }
    toString(settings: TsTypeSettings = DEFAULT_SETTINGS): string {
      return this.safeId()
    }
    toDeclaration(settings: TsTypeSettings): string {
      return this.toBlockComment(settings)
        + `export ${settings.useConstEnums ? 'const ' : ''}enum ${this.safeId()} {`
        + '\n'
        + INDENT_STRING
        + this.value.map(_ => _.toDeclaration()).join(`,\n${INDENT_STRING}`)
        + '\n'
        + '}'
    }
  }

  export class Array extends TsTypeBase<TsTypeBase<any>> {
    constructor(value: TsTypeBase<any> = new Any) { super(value) }
    toString(settings: TsTypeSettings = DEFAULT_SETTINGS) {
      const type = this.value.toType(settings)
      return `${type.indexOf('|') > -1 || type.indexOf('&') > -1 ? `(${type})` : type}[]` // hacky
    }
  }

  export class Intersection<T> extends TsTypeBase<TsTypeBase<T>[]> {
    isSimpleType() { return this.value.filter(_ => !(_ instanceof Null)).length <= 1 }
    toString(settings: TsTypeSettings = DEFAULT_SETTINGS) {
      return this.value
        .filter(_ => !(_ instanceof Null))
        .map(_ => _.toType(settings))
        .join(' & ')
    }
  }

  export class Union<T> extends TsTypeBase<TsTypeBase<T>[]> {
    isSimpleType() { return this.value.length <= 1 }
    toString(settings: TsTypeSettings = DEFAULT_SETTINGS) {
      return this.value
        .map(_ => _.toType(settings))
        .join(' | ')
    }
  }

  export class Interface extends TsTypeBase<TsProp<any>[]> {
    static reference(id: string) {
      let ret = new Interface([])
      ret.id = id
      return ret
    }
    toString(settings: TsTypeSettings = DEFAULT_SETTINGS) {
      return `{\n`
        + `${this.value.map(_ =>
        `${INDENT_STRING}${_.type.description
          ? generateComment(_.type.description).join(`\n${INDENT_STRING}`) + `\n${INDENT_STRING}`
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
      return `${this.toBlockComment(settings)}export interface ${this.safeId()} ${this.toString(settings)}`
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

function generateComment(string: string): string[] {
  return [
    COMMENT_START,
    ...string.split('\n').map(_ => COMMENT_INDENT + _),
    COMMENT_END
  ]
}
