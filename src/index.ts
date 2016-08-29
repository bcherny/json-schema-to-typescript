import {camelCase, isPlainObject, last, map, merge, uniqBy, upperFirst, zip} from 'lodash'
import {JSONSchema} from './JSONSchema'
import {readFile, readFileSync} from 'fs'
import {dirname, join, parse, resolve, ParsedPath} from 'path'
import {Readable} from 'stream'
import {format} from './pretty-printer'
import {TsType} from './TsTypes'

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

  constructor(private schema: JSONSchema.Schema, filePath: string, settings?: TsType.TsTypeSettings) {
    let path = resolve(filePath);
    this.filePath = parse(path);
    this.declarations = new Map();
    this.id = schema.id || schema.title || this.filePath.name || "Interface1";
    this.settings = Object.assign({}, Compiler.DEFAULT_SETTINGS, settings);
    let decl = this.declareType(this.toTsType(this.schema, '', true), this.id, this.id);
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
  private filePath: ParsedPath;

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
    if (rule.type === 'array' && rule.items) {
      return RuleType.TypedArray
    }
    // enum type vs enum constant?
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
  // only called in case of a $ref type
  private resolveType(refPath: string, propName: string): TsType.TsType {
    if (refPath === '#' || refPath === '#/'){
      return TsType.Interface.reference(this.id);
    } 

    if (refPath[0] !== '#'){
      let fullPath = resolve(join(this.filePath.dir, refPath));
      let file = readFileSync(fullPath);
      let targetType = this.toTsType(JSON.parse(file.toString()), propName, false, true);
      if(targetType.id){
        return new TsType.Literal(targetType.id);      
      } else {
        let parsedNewFile = parse(fullPath);
        return new TsType.Literal(parsedNewFile.name);
      }
    };

    const parts = refPath.slice(2).split('/');
    let ret = this.settings.declareReferenced ? this.declarations.get(parts.join('/')) : undefined;
    if (!ret) {
      let cur: any = this.schema;
      let i = 0;
      for (let i = 0; cur && i < parts.length; ++i) {
        cur = cur[parts[i]];
      }
      ret = this.toTsType(cur);
      if (this.settings.declareReferenced && (this.settings.declareSimpleType || !ret.isSimpleType()))
        this.declareType(ret, parts.join('/'), this.settings.useFullReferencePathAsName ? parts.join('/') : last(parts));
    }
    return ret;
  }

  private isReference(schema: JSONSchema.Schema){
    return schema.$ref; // && !schema.$ref.startsWith('#');
  }

  private declareType(type: TsType.TsType, refPath: string, id: string) {
      type.id = id;
      this.declarations.set(refPath, type);
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
          return {
            type: this.toStringLiteral(v),
            name: k,
            required: true
          };
        }));
      // TODO: support array types?
      // TODO: support enums of enums
      // TODO: support nulls
    }
  }

  private createTsType (rule: JSONSchema.Schema, propName?: string, isTop: boolean = false, isReference: boolean = false): TsType.TsType {
    switch (this.getRuleType(rule)) {
      case RuleType.AnonymousSchema:
      case RuleType.NamedSchema:
        return this.toTsDeclaration(rule);
      case RuleType.Enum:
        // TODO:  honor the schema's "type" on the enum.  if string,
        // skip all the zipping mess; if int, either require the tsEnumNames 
        // or generate literals for the values

        // TODO:  what to do in the case where the value is an Object?  
        // right now we just pring [Object object] as the literal which is bad
        if(this.settings.useTypescriptEnums){
          var enumValues = zip(rule.tsEnumNames || [], 
              rule.enum!.map(_ => new TsType.Literal(_).toType(this.settings)))
            .map(_ => new TsType.EnumValue(_));

          // TODO:  how do I get the property name under which this was declared
          // (or the file name, failing that)? that would make a much better name here.
          let path = rule.id || propName || ("Enum" + enumValues.map(_ => _.identifier).join(""));
          let retVal: TsType.TsType = new TsType.Enum(enumValues);

          // don't add this to the declarations map if this is the top-level type (already declared)
          // or if it's a reference and we don't want to declare those.
          if(!isTop && (!isReference || this.settings.declareReferenced)){
            retVal = this.declareType(retVal, path, path);
          }
          return retVal;
          
        } else {
          return new TsType.Union(uniqBy(
            rule.enum!.map(_ => this.toStringLiteral(_))
            , _ => _.toType(this.settings)));
        }
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
        return this.resolveType(rule.$ref!, propName!);
    }
    throw "bug";
  } 

  private toTsType (rule: JSONSchema.Schema, propName?: string, isTop: boolean = false, isReference: boolean = false): TsType.TsType {
    let type = this.createTsType(rule, propName, isTop, isReference);
    type.id = type.id || rule.id || rule.title;
    type.description = type.description || rule.description;
    return type;
  }
  private toTsDeclaration (schema: JSONSchema.Schema) : TsType.TsType {
    let copy = merge({}, Compiler.DEFAULT_SCHEMA, schema);
    let set = new Set();
    let props = map(
      copy.properties!,
      (v: JSONSchema.Schema, k: string) => {
        return {
          type: this.toTsType(v, k),
          name: k,
          required: this.isRequired(k, copy)
        };
      });
    if (props.length === 0 && !("additionalProperties" in schema)) {
      if ("default" in schema)
        return new TsType.Void;
    }
    if (this.supportsAdditionalProperties(copy)) {
      let short = copy.additionalProperties === true;
      if (short && props.length === 0)
        return new TsType.Any;
      let type = short ? new TsType.Any : this.toTsType(<JSONSchema.Schema>copy.additionalProperties);
      props.push({
          type: type,
          name: '[k: string]',
          required: true
        });
    }
    return new TsType.Interface(props);
  }
}

export function compile(schema: JSONSchema.Schema, path: string, settings?: TsType.TsTypeSettings): string {
  return new Compiler(schema, path, settings).toString()
}

export function compileFromFile(inputFilename: string): Promise<string|Error> {
  return new Promise((resolve, reject) =>
    readFile(inputFilename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(compile(JSON.parse(data.toString()), inputFilename))
      }
    })
  )
}