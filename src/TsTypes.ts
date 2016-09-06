import { camelCase, upperFirst } from 'lodash'

export namespace TsType {

  export interface TsTypeSettings {
    addEnumUtils?: boolean
    declarationDescription?: boolean
    // TODO declareProperties?: boolean
    declareReferenced?: boolean
    declareSimpleType?: boolean
    exportInterfaces?: boolean
    endPropertyWithSemicolon?: boolean
    endTypeWithSemicolon?: boolean
    propertyDescription?: boolean
    useConstEnums?: boolean
    useFullReferencePathAsName?: boolean
    useInterfaceDeclaration?: boolean
    useTypescriptEnums?: boolean
  }

  export var DEFAULT_SETTINGS: TsTypeSettings = {
    addEnumUtils: false,
    declarationDescription: true,
    // declareProperties: false,
    declareReferenced: true,
    declareSimpleType: false,
    endPropertyWithSemicolon: true,
    endTypeWithSemicolon: true,
    propertyDescription: true,
    useConstEnums: false,
    useFullReferencePathAsName: false,
    useInterfaceDeclaration: true,
    useTypescriptEnums: false
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

export class EnumValue {
  identifier: string
  value: string

  constructor(enumValues: string[]) {
    let hasValue = !!enumValues[0]

    // quirky propagation logic
    if (hasValue){
      this.identifier = enumValues[0]
      this.value = enumValues[1]
    } else {
      this.identifier = enumValues[1]
    }
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

export class Enum extends TsType {
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
    return `${this.toBlockComment(settings)}export ${settings.useConstEnums ? "const " : ""}enum ${this._type(settings)}{
      ${this.enumValues.map(_ => _.toDeclaration()).join(',\n')}
    }`
  }
}

export class EnumUtils extends TsType {
  constructor(protected enm: Enum) {
    super()
  }
  isSimpleType() { return false }
  _type(settings: TsTypeSettings) {
    // It's a bit hacky, but if this is a top level type, then addDeclaration changes 
    // our enum type's ID out from under us when it adds the enum to the declaration map, *after*
    // the util class is declared.  So we name ourselves by our enum's type, not our own ID'
    return `${this.enm.toSafeType(settings)}Util` || this.safeId() || 'SomeEnumTypeUtils'
  }
  toSafeType(settings: TsTypeSettings) {
    return `${this.toType(settings)}`
  }
  toDeclaration(settings: TsTypeSettings): string {
    return `${this.toBlockComment(settings)}export class ${this._type(settings)} {
      ${this.makeValuesMethod(settings)}
      ${this.makeToStringValueMethod(settings)}
      ${this.makeFromStringValueMethod(settings)}
      ${this.makeFromStringValuesMethod(settings)}
    }`
  }
  makeValuesMethod(settings: TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static values(): ${enumType}[] {
    return [${this.enm.enumValues.map(_ => `${enumType}.${_.identifier}`).join(',')}]
  }`
  }
  makeFromStringValueMethod(settings: TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static fromStringValue(value: string): ${enumType} {
    switch(value.toLowerCase()){
      ${this.enm.enumValues.map(_ => `case "${_.identifier.toLowerCase()}":
        return ${enumType + '.' + _.identifier};`).join('\n')}
      default:
        throw new Error("Unrecognized ${enumType}: " + value);
    }
  }`
  }
  makeToStringValueMethod(settings: TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static toStringValue(enm: ${enumType}): string {
    switch(enm){
      ${this.enm.enumValues.map(_ => `case ${enumType + '.' + _.identifier}:
        return "${_.identifier.toLowerCase()}";`).join('\n')}
    }
  }`
  }
  makeFromStringValuesMethod(settings: TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static fromStringValues(values: string[]): ${enumType}[] {
    return _.map(values, value => ${this._type(settings)}.fromStringValue(value));
  }`
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
          let decl = '    ' + _.name
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
      if (settings.useInterfaceDeclaration)
        return `${this.toBlockComment(settings)}export interface ${this.safeId()} ${this._type(settings, true)}`
      return this._toDeclaration(`type ${this.safeId()} = ${this._type(settings, true)}`, settings)
    }
  }

}
