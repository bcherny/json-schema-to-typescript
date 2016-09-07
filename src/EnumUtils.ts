import * as TsTypes from './TsTypes'

export class EnumUtils extends TsTypes.TsType.TsTypeBase {
  constructor(protected enm: TsTypes.TsType.Enum) {
    super()
  }
  isSimpleType() { return false }
  _type(settings: TsTypes.TsType.TsTypeSettings) {
    // It's a bit hacky, but if this is a top level type, then addDeclaration changes 
    // our enum type's ID out from under us when it adds the enum to the declaration map, *after*
    // the util class is declared.  So we name ourselves by our enum's type, not our own ID'
    return `${this.enm.toSafeType(settings)}Util` || this.safeId() || 'SomeEnumTypeUtils'
  }
  toSafeType(settings: TsTypes.TsType.TsTypeSettings) {
    return `${this.toType(settings)}`
  }
  toDeclaration(settings: TsTypes.TsType.TsTypeSettings): string {
    return `${this.toBlockComment(settings)}export class ${this._type(settings)} {
      ${this.makeValuesMethod(settings)}
      ${this.makeToStringValueMethod(settings)}
      ${this.makeFromStringValueMethod(settings)}
      ${this.makeFromStringValuesMethod(settings)}
    }`
  }
  makeValuesMethod(settings: TsTypes.TsType.TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static values(): ${enumType}[] {
    return [${this.enm.enumValues.map(_ => `${enumType}.${_.identifier}`).join(',')}]
  }`
  }
  makeFromStringValueMethod(settings: TsTypes.TsType.TsTypeSettings){
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
  makeToStringValueMethod(settings: TsTypes.TsType.TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static toStringValue(enm: ${enumType}): string {
    switch(enm){
      ${this.enm.enumValues.map(_ => `case ${enumType + '.' + _.identifier}:
        return "${_.identifier.toLowerCase()}";`).join('\n')}
    }
  }`
  }
  makeFromStringValuesMethod(settings: TsTypes.TsType.TsTypeSettings){
    let enumType = this.enm.toSafeType(settings)
    return `static fromStringValues(values: string[]): ${enumType}[] {
    return _.map(values, value => ${this._type(settings)}.fromStringValue(value));
  }`
  }
}
