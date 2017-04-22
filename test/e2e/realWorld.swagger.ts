/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/49
 */
export const input = {
  title: 'Referencing',
  type: 'object',
  properties: {
    foo: {
      $ref: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/ae9322eb2df1555acf3163e30cd84779d98afec5/schemas/v2.0/schema.json'
    }
  },
  required: ['foo'],
  additionalProperties: false
}

export let output = `/**
 * The transfer protocol of the API.
 */
export type SchemesList = ("http" | "https" | "ws" | "wss")[];
export type MediaTypeList = MimeType[];
export type Title = string;
export type Description = string;
export type Default = any;
export type MultipleOf = number;
export type Maximum = number;
export type ExclusiveMaximum = boolean;
export type Minimum = number;
export type ExclusiveMinimum = boolean;
export type MaxLength = number;
export type MinLength = MaxLength;
export type Pattern = string;
export type UniqueItems = boolean;
export type Enum = any[];
export type Parameter = (BodyParameter | NonBodyParameter);
export type NonBodyParameter = (HeaderParameterSubSchema | FormDataParameterSubSchema | QueryParameterSubSchema | PathParameterSubSchema);
export type CollectionFormat = ("csv" | "ssv" | "tsv" | "pipes");
export type CollectionFormatWithMulti = ("csv" | "ssv" | "tsv" | "pipes" | "multi");
export type Security = SecurityRequirement[];

export interface Referencing {
  foo: AJsonSchemaForSwagger20Api;
}
export interface AJsonSchemaForSwagger20Api {
  /**
   * The Swagger version of this document.
   */
  swagger: "2.0";
  info: Info;
  /**
   * The host (name or ip) of the API. Example: 'swagger.io'
   */
  host?: string;
  /**
   * The base path to the API. Example: '/api'.
   */
  basePath?: string;
  schemes?: SchemesList;
  /**
   * A list of MIME types accepted by the API.
   */
  consumes?: MediaTypeList;
  /**
   * A list of MIME types the API can produce.
   */
  produces?: MediaTypeList;
  paths: Paths;
  definitions?: Definitions;
  parameters?: ParameterDefinitions;
  responses?: ResponseDefinitions;
  security?: Security;
  securityDefinitions?: SecurityDefinitions;
  tags?: Tag[];
  externalDocs?: ExternalDocs;
}
/**
 * General information about the API.
 */
export interface Info {
  /**
   * A unique and precise title of the API.
   */
  title: string;
  /**
   * A semantic version number of the API.
   */
  version: string;
  /**
   * A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The terms of service for the API.
   */
  termsOfService?: string;
  contact?: Contact;
  license?: License;
}
/**
 * Contact information for the owners of the API.
 */
export interface Contact {
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL pointing to the contact information.
   */
  url?: string;
  /**
   * The email address of the contact person/organization.
   */
  email?: string;
}
export interface License {
  /**
   * The name of the license type. It's encouraged to use an OSI compatible license.
   */
  name: string;
  /**
   * The URL pointing to the license.
   */
  url?: string;
}
/**
 * Relative paths to the individual endpoints. They must be relative to the 'basePath'.
 */
export interface Paths {

}
/**
 * One or more JSON objects describing the schemas being consumed and produced by the API.
 */
export interface Definitions {
  [k: string]: Schema;
}
/**
 * A deterministic version of a JSON Schema object.
 */
export interface Schema {
  $ref?: string;
  format?: string;
  title?: Title;
  description?: Description;
  default?: Default;
  multipleOf?: MultipleOf;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  maxProperties?: MaxLength;
  minProperties?: MinLength;
  required?: string[];
  enum?: Enum;
  additionalProperties?: (Schema | boolean);
  type?: (("array" | "boolean" | "integer" | "null" | "number" | "object" | "string") | ("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")[]);
  items?: (Schema | Schema[]);
  allOf?: Schema[];
  properties?: {
    [k: string]: Schema;
  };
  discriminator?: string;
  readOnly?: boolean;
  xml?: Xml;
  externalDocs?: ExternalDocs;
  example?: any;
}
export interface Xml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}
/**
 * information about external documentation
 */
export interface ExternalDocs {
  description?: string;
  url: string;
}
/**
 * One or more JSON representations for parameters
 */
export interface ParameterDefinitions {
  [k: string]: Parameter;
}
export interface BodyParameter {
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The name of the parameter.
   */
  name: string;
  /**
   * Determines the location of the parameter.
   */
  in: "body";
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean;
  schema: Schema;
}
export interface HeaderParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean;
  /**
   * Determines the location of the parameter.
   */
  in?: "header";
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The name of the parameter.
   */
  name?: string;
  type?: ("string" | "number" | "boolean" | "integer" | "array");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
}
export interface PrimitivesItems {
  type?: ("string" | "number" | "integer" | "boolean" | "array");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
}
export interface FormDataParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean;
  /**
   * Determines the location of the parameter.
   */
  in?: "formData";
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The name of the parameter.
   */
  name?: string;
  /**
   * allows sending a parameter by name only or with an empty value.
   */
  allowEmptyValue?: boolean;
  type?: ("string" | "number" | "boolean" | "integer" | "array" | "file");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormatWithMulti;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
}
export interface QueryParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean;
  /**
   * Determines the location of the parameter.
   */
  in?: "query";
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The name of the parameter.
   */
  name?: string;
  /**
   * allows sending a parameter by name only or with an empty value.
   */
  allowEmptyValue?: boolean;
  type?: ("string" | "number" | "boolean" | "integer" | "array");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormatWithMulti;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
}
export interface PathParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required: true;
  /**
   * Determines the location of the parameter.
   */
  in?: "path";
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string;
  /**
   * The name of the parameter.
   */
  name?: string;
  type?: ("string" | "number" | "boolean" | "integer" | "array");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
}
/**
 * One or more JSON representations for parameters
 */
export interface ResponseDefinitions {
  [k: string]: Response;
}
export interface Response {
  description: string;
  schema?: (Schema | FileSchema);
  headers?: Headers;
  examples?: Examples;
}
/**
 * A deterministic version of a JSON Schema object.
 */
export interface FileSchema {
  format?: string;
  title?: Title;
  description?: Description;
  default?: Default;
  required?: string[];
  type: "file";
  readOnly?: boolean;
  externalDocs?: ExternalDocs;
  example?: any;
}
export interface Headers {
  [k: string]: Header;
}
export interface Header {
  type: ("string" | "number" | "integer" | "boolean" | "array");
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxLength;
  minItems?: MinLength;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  description?: string;
}
export interface Examples {
  [k: string]: any;
}
export interface SecurityDefinitions {
  [k: string]: (BasicAuthenticationSecurity | ApiKeySecurity | Oauth2ImplicitSecurity | Oauth2PasswordSecurity | Oauth2ApplicationSecurity | Oauth2AccessCodeSecurity);
}
export interface BasicAuthenticationSecurity {
  type: "basic";
  description?: string;
}
export interface ApiKeySecurity {
  type: "apiKey";
  name: string;
  in: ("header" | "query");
  description?: string;
}
export interface Oauth2ImplicitSecurity {
  type: "oauth2";
  flow: "implicit";
  scopes?: Oauth2Scopes;
  authorizationUrl: string;
  description?: string;
}
export interface Oauth2Scopes {
  [k: string]: string;
}
export interface Oauth2PasswordSecurity {
  type: "oauth2";
  flow: "password";
  scopes?: Oauth2Scopes;
  tokenUrl: string;
  description?: string;
}
export interface Oauth2ApplicationSecurity {
  type: "oauth2";
  flow: "application";
  scopes?: Oauth2Scopes;
  tokenUrl: string;
  description?: string;
}
export interface Oauth2AccessCodeSecurity {
  type: "oauth2";
  flow: "accessCode";
  scopes?: Oauth2Scopes;
  authorizationUrl: string;
  tokenUrl: string;
  description?: string;
}
`
