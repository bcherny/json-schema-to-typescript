import { camelCase, upperFirst } from 'lodash'
import { Settings } from './index'

const COMMENT_START  = '/**'
const COMMENT_INDENT = ' * '
const COMMENT_END    = ' */'
const INDENT_STRING  = '  '

export abstract class TsType<T> {
  id: string
  description?: string

  constructor(protected value: T) {}

  protected safeId() {
    return nameToTsSafeName(this.id)
  }
  protected toBlockComment() {
    return this.description && !this.isSimpleType()
      ? `${generateComment(this.description).join('\n')}\n`
      : ''
  }
  isSimpleType() { return true }
  toDeclaration(settings: Settings): string {
    return this.toBlockComment()
      + `export type ${this.safeId()} = ${this.toString(settings)}`
      + (settings.endTypeWithSemicolon ? ';' : '')
  }
  toType(settings: Settings): string {
    return this.safeId() || this.toString(settings)
  }
  abstract toString(settings: Settings): string
}

export interface TsProp<T> {
  name: string
  required: boolean
  type: TsType<T>
}

export class TAny extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'any'
  }
}
export class TString extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'string'
  }
}
export class TBoolean extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'boolean'
  }
}
export class TNumber extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'number'
  }
}
export class TObject extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'Object'
  }
}
export class TNull extends TsType<void> {
  constructor() { super(undefined) }
  toString() {
    return 'null'
  }
}
export class TLiteral<T> extends TsType<T> {
  toString() {
    return JSON.stringify(this.value)
  }
}

export class TReference extends TsType<string> {
  toString() { return this.value }
}

export class TEnumValue extends TsType<string> {
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

export class TEnum extends TsType<TEnumValue[]> {
  constructor(public id: string, value: TEnumValue[]) {
    super(value)
  }
  isSimpleType() { return false }
  toString(settings: Settings): string {
    return this.safeId()
  }
  toDeclaration(settings: Settings): string {
    return this.toBlockComment()
      + `export ${settings.useConstEnums ? 'const ' : ''}enum ${this.safeId()} {`
      + '\n'
      + INDENT_STRING
      + this.value.map(_ => _.toDeclaration()).join(`,\n${INDENT_STRING}`)
      + '\n'
      + '}'
  }
}

export class TArray extends TsType<TsType<any>> {
  constructor(value: TsType<any> = new TAny) { super(value) }
  toString(settings: Settings) {
    const type = this.value.toType(settings)
    return `${type.indexOf('|') > -1 || type.indexOf('&') > -1 ? `(${type})` : type}[]` // hacky
  }
}

export class TIntersection<T> extends TsType<TsType<T>[]> {
  isSimpleType() { return this.value.length <= 1 }
  toString(settings: Settings) {
    return this.value
      .filter(_ => !(_ instanceof TNull))
      .map(_ => _.toType(settings))
      .join(' & ')
  }
}

export class TUnion<T> extends TsType<TsType<T>[]> {
  isSimpleType() { return this.value.length <= 1 }
  toString(settings: Settings) {
    return this.value
      .map(_ => _.toType(settings))
      .join(' | ')
  }
}

export class TInterface extends TsType<TsProp<any>[]> {
  static reference(id: string) {
    let ret = new TInterface([])
    ret.id = id
    return ret
  }
  toString(settings: Settings) {
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
  toDeclaration(settings: Settings): string {
    return `${this.toBlockComment()}export interface ${this.safeId()} ${this.toString(settings)}`
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
