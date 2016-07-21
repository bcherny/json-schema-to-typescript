import {camelCase, upperFirst} from 'lodash'

export type TsTypeSettings = {
    declareReferenced: boolean;
    // TODO declareProperties: boolean;
    useInterfaceDeclaration: boolean;
    endTypeWithSemicolon: boolean;
    endPropertyWithSemicolon: boolean;
    declarationDescription: boolean;
    propertyDescription: boolean;
};

export var DEFAULT_SETTINGS: TsTypeSettings = {
  declareReferenced: true,
  // declareProperties: false,
  useInterfaceDeclaration: false,
  endTypeWithSemicolon: true,
  endPropertyWithSemicolon: true,
  declarationDescription: true,
  propertyDescription: true,
};

export abstract class TsType {
  id?: string;
  description?: string;

  protected safeId() {
    return this.id && upperFirst(camelCase(this.id)); 
  }
  protected toBlockComment(settings: TsTypeSettings) {
    return this.description && settings.declarationDescription ? `/** ${this.description} */\n` : '';
  }
  protected _toDeclaration(decl: string, settings: TsTypeSettings): string
  {
    return this.toBlockComment(settings) + decl + (settings.endTypeWithSemicolon ? ";" : "");
  }
  toDeclaration(settings: TsTypeSettings): string
  {
    return this._toDeclaration(`type ${this.safeId()} = ${this.toType(settings)}`, settings);
  }
  abstract toType(settings: TsTypeSettings): string
  toString() : string {
    return this.toType(DEFAULT_SETTINGS);
  }
}
export type TsProp = TsType & {
  name: string;
  required: boolean;
}

export class Any extends TsType {
  toType() {
    return 'any'
  }
}
export class String extends TsType {
  toType() {
    return 'string'
  }
}
export class Boolean extends TsType {
  toType() {
    return 'boolean'
  }
}
export class Number extends TsType {
  toType() {
    return 'number'
  }
}
export class Object extends TsType {
  toType() {
    return 'Object'
  }
}
export class Void extends TsType {
  toType() {
    return 'void'
  }
}
export class Literal extends TsType {
  constructor(private value: any) { super() }
  toType() {
    return this.value
  }
}

export class Array extends TsType {
  constructor(private type?: TsType) { super() }
  toType(settings: TsTypeSettings) {
    return `${(this.type || new Any()).toType(settings)}[]`
  }
}
export class Intersection extends TsType {
  constructor(private data: TsType[]) { super() }
  toType(settings: TsTypeSettings) {
    return this.data.map(_ => _.toType(settings)).join('&')
  }
}
export class Union extends TsType {
  constructor(private data: TsType[]) { super() }
  toType(settings: TsTypeSettings) {
    return this.data.map(_ => _.toType(settings)).join('|')
  }
}

export class Interface extends TsType {
  constructor(private props: TsProp[]) {
    super()
  }
  static reference(id: string) {
    let ret = new Interface([]);
    ret.id = id;
    return ret;
  }
  protected _toType(settings: TsTypeSettings, declaration: boolean) : string {
    return declaration || !this.id ? `{
        ${this.props.map(_ => {
          let decl = _.name;
          if (!_.required)
            decl += '?';
          decl += ": " + _.toString();
          if (settings.endPropertyWithSemicolon)
            decl += ';';
          if (settings.propertyDescription && _.description)
            decl += ' // ' + _.description;
          return decl;
        }).join('\n')}
      }` : <string>this.safeId();
  }
  toType(settings: TsTypeSettings) {
    return this._toType(settings, false)
  }
  toDeclaration(settings: TsTypeSettings): string {
    if (settings.useInterfaceDeclaration)
      return `${this.toBlockComment(settings)}interface ${this.safeId()} ${this._toType(settings, true)}`
    else
      return this._toDeclaration(`type ${this.safeId()} = ${this._toType(settings, true)}`, settings);
  }
}
