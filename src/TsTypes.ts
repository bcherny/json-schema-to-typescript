import { camelCase, upperFirst } from 'lodash'

export namespace TsType {

  export interface TsTypeSettings {
    declareSimpleType?: boolean
    declareReferenced?: boolean
    useFullReferencePathAsName?: boolean
    // TODO declareProperties?: boolean
    useInterfaceDeclaration?: boolean
    endTypeWithSemicolon?: boolean
    endPropertyWithSemicolon?: boolean
    declarationDescription?: boolean
    propertyDescription?: boolean
  }

  export var DEFAULT_SETTINGS: TsTypeSettings = {
    declarationDescription: true,
    declareReferenced: true,
    declareSimpleType: false,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    propertyDescription: true,
    useFullReferencePathAsName: false,
    // declareProperties: false,
    useInterfaceDeclaration: true
  }

  export abstract class TsType {
    id?: string
    description?: string

    protected safeId() {
      return this.id && upperFirst(camelCase(this.id))
    }
    protected toBlockComment(settings: TsTypeSettings) {
      return this.description && settings.declarationDescription ? `/** ${this.description} */\n` : ''
    }
    protected _toDeclaration(decl: string, settings: TsTypeSettings): string {
      return this.toBlockComment(settings) + decl + (settings.endTypeWithSemicolon ? ';' : '')
    }
    protected abstract _type(settings: TsTypeSettings): string
    isSimpleType() { return true }
    toDeclaration(settings: TsTypeSettings): string {
      return this._toDeclaration(`type ${this.safeId()} = ${this._type(settings)}`, settings)
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
    type: TsType
  }

  export class Any extends TsType {
    _type() {
      return 'any'
    }
  }
  export class String extends TsType {
    _type() {
      return 'string'
    }
  }
  export class Boolean extends TsType {
    _type() {
      return 'boolean'
    }
  }
  export class Number extends TsType {
    _type() {
      return 'number'
    }
  }
  export class Object extends TsType {
    _type() {
      return 'Object'
    }
  }
  export class Void extends TsType {
    _type() {
      return 'void'
    }
  }
  export class Literal extends TsType {
    constructor(private value: any) { super() }
    _type() {
      return this.value
    }
  }

  export class Array extends TsType {
    constructor(private type?: TsType) { super() }
    _type(settings: TsTypeSettings) {
      return `${(this.type || new Any()).toSafeType(settings)}[]`
    }
  }
  export class Intersection extends TsType {
    constructor(protected data: TsType[]) {
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

  export class Interface extends TsType {
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
          let decl = _.name
          if (!_.required)
            decl += '?'
          decl += ': ' + _.type.toType(settings)
          if (settings.endPropertyWithSemicolon)
            decl += ';'
          if (settings.propertyDescription && _.type.description)
            decl += ' // ' + _.type.description
          return decl
        }).join('\n')}
      }` : id
    }
    isSimpleType() { return false }
    toDeclaration(settings: TsTypeSettings): string {
      if (settings.useInterfaceDeclaration) {
        return `${this.toBlockComment(settings)}interface ${this.safeId()} ${this._type(settings, true)}`
      } else {
        return this._toDeclaration(`type ${this.safeId()} = ${this._type(settings, true)}`, settings)
      }
    }
  }

}
