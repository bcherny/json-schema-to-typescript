import {camelCase, isPlainObject, last, map, merge, uniqBy, upperFirst} from 'lodash'
import {readFile} from 'fs'
import {Readable} from 'stream'
import {format} from './pretty-printer'
import * as TsType from './TsTypes'

enum RuleType {"Any","TypedArray","Enum","AllOf","AnyOf","Reference","NamedSchema", "AnonymousSchema",
  "String","Number","Void","Object","Array","Boolean","Literal"}


class Compiler {
  static DEFAULT_SETTINGS = TsType.DEFAULT_SETTINGS;

  static DEFAULT_SCHEMA: JSONSchema.Schema = {
    additionalProperties: true,
    properties: {},
    required: [],
    type: 'object'
  }

  constructor(private schema: JSONSchema.Schema, settings?: TsType.TsTypeSettings) {
    this.id = schema.id || schema.title || "Interface1";
    this.declarations = new Map();
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings);
    let decl = this.declareType(this.toTsType(this.schema), this.id);
    this.declarations.set(this.id, decl);
  }

  toString(): string {
    return format(
      Array.from(this.declarations.values())
        .map(_ => _.toDeclaration(this.settings))
        .join('\n')
    )
  }

  private settings: TsType.TsTypeSettings;
  private id: string;
  private declarations: Map<string, TsType.TsType>;

  private isRequired(propertyName: string, schema: JSONSchema.Schema): boolean {
    return schema.required ? schema.required.indexOf(propertyName) > -1 : false;
  }

  private supportsAdditionalProperties(schema: JSONSchema.Schema): boolean {
    return schema.additionalProperties === true || isPlainObject(schema.additionalProperties)
  }

  private toDeclarationName (a: string): string {
    return upperFirst(camelCase(a))
  }

  private getRuleType (rule: JSONSchema.Schema): RuleType {
    if (rule.type === 'array' && rule.items && rule.items.type) {
      return RuleType.TypedArray
    }
    if (rule.enum) {
      return RuleType.Enum
    }
    if (rule.properties || rule.additionalProperties) {
      return RuleType.NamedSchema
    }
    if (rule.allOf) {
      return RuleType.AllOf
    }
    if (rule.anyOf) {
      return RuleType.AnyOf
    }
    if (rule.$ref) {
      return RuleType.Reference
    }
    switch (rule.type) {
      case 'array': return RuleType.Array
      case 'boolean': return RuleType.Boolean
      case 'integer': case 'number': return RuleType.Number
      case 'null': return RuleType.Void
      case 'object': return RuleType.Object
      case 'string': return RuleType.String
    }
    if (this.isNumberLiteral(rule)) {
      return RuleType.Number
    }
    if (!isPlainObject(rule)) {
      return RuleType.Literal
    }
    if (isPlainObject(rule)) {
      return RuleType.AnonymousSchema // TODO: is it safe to do this as a catchall?
    }
    return RuleType.Any
  }

  private isNumberLiteral (a: any): boolean {
    return /^[\d\.]+$/.test(a)
  }

  // eg. "#/definitions/diskDevice" => ["definitions", "diskDevice"]
  private resolveType(path: string): TsType.TsType {
    if (path[0] !== '#')
      throw new Error("reference must start with #");
    console.info("resolving", path, this.id);
    if (path === '#' || path === '#/')
      return TsType.Interface.reference(this.id);
    const parts = path.slice(2).split('/');
    let ret = this.settings.declareReferenced ? this.declarations.get(parts.join('/')) : undefined;
    if (!ret) {
      let cur: any = this.schema;
      let i = 0;
      for (let i = 0; cur && i < parts.length; ++i) {
        cur = cur[parts[i]];
      }
      ret = this.toTsType(cur);
      if (this.settings.declareReferenced)
        this.declareType(ret, parts.join('/'));
    }
    return ret;
  }

  private declareType(type: TsType.TsType, id: string) {
      type.id = id;
      this.declarations.set(type.id, type);
      return type;
  }

  private toStringLiteral(a: boolean|number|string|Object): TsType.TsType {
    switch (typeof a) {
      case 'boolean': return new TsType.Boolean; // ts doesn't support literal boolean types
      case 'number': return new TsType.Number;   // ts doesn't support literal numeric types
      case 'string': return new TsType.Literal(JSON.stringify(a));
      default: return new TsType.Interface(map(
        <any>a,
        (v: JSONSchema.Schema, k: string) => {
          let prop = <TsType.TsProp>this.toTsType(v);
          prop.name = k;
          prop.required = true;
          return prop;
        }));
      // TODO: support array types?
      // TODO: support enums of enums
      // TODO: support nulls
    }
  }

  private createTsType (rule: JSONSchema.Schema): TsType.TsType {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration(rule);
      case RuleType.Enum:
        return new TsType.Union(uniqBy(
          rule.enum!.map(_ => this.toStringLiteral(_))
          , _ => _.toType(this.settings))
        )
      case RuleType.Any: return new TsType.Any
      case RuleType.Literal: return new TsType.Literal(rule)
      case RuleType.TypedArray: return new TsType.Array(this.toTsType(rule.items!))
      case RuleType.Array: return new TsType.Array
      case RuleType.Boolean: return new TsType.Boolean
      case RuleType.Number: return new TsType.Number
      case RuleType.Object: return new TsType.Object
      case RuleType.String: return new TsType.String
      case RuleType.Void: return new TsType.Void
      case RuleType.AllOf:
        return new TsType.Intersection(rule.allOf!.map(_ => this.toTsType(_)))
      case RuleType.AnyOf:
        return new TsType.Union(rule.anyOf!.map(_ => this.toTsType(_)))
      case RuleType.Reference:
        return this.resolveType(rule.$ref!);
    }
    throw "bug";
  } 
  private toTsType (rule: JSONSchema.Schema): TsType.TsType {
    let type = this.createTsType(rule);
    type.id = type.id || rule.id || rule.title;
    type.description = type.description || rule.description;
    return type;
  }
  private toTsDeclaration (schema: JSONSchema.Schema) : TsType.TsType {
    schema = merge({}, Compiler.DEFAULT_SCHEMA, schema);
    let props = map(
      schema.properties!,
      (v: JSONSchema.Schema, k: string) => {
        let prop = <TsType.TsProp>this.toTsType(v);
        prop.name = k;
        prop.required = this.isRequired(k, schema);
        return prop;
      });
    if (this.supportsAdditionalProperties(schema)) {
      let prop = <TsType.TsProp>(schema.additionalProperties === true ? new TsType.Any
          : this.toTsType(<JSONSchema.Schema>schema.additionalProperties));
      prop.required = true;
      prop.name = '[k: string]';
      props.push(prop);
    }
    return new TsType.Interface(props);
  }
}

export function compile(schema: JSONSchema.Schema): string {
  return new Compiler(schema).toString()
}

export function compileFromFile(inputFilename: string): Promise<string|Error> {
  return new Promise((resolve, reject) =>
    readFile(inputFilename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(compile(JSON.parse(data.toString())))
      }
    })
  )
}