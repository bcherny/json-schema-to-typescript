declare module JSONSchema {


  type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
  /** Core schema meta-schema */
  type HttpJsonSchemaOrgDraft04Schema = {
    id?: string;
    $schema?: string;
    title?: string;
    description?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: boolean | HttpJsonSchemaOrgDraft04Schema;
    items?: HttpJsonSchemaOrgDraft04Schema | HttpJsonSchemaOrgDraft04Schema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean | HttpJsonSchemaOrgDraft04Schema;
    definitions?: {
      [k: string]: HttpJsonSchemaOrgDraft04Schema;
    };
    properties?: {
      [k: string]: HttpJsonSchemaOrgDraft04Schema;
    };
    patternProperties?: {
      [k: string]: HttpJsonSchemaOrgDraft04Schema;
    };
    dependencies?: {
      [k: string]: HttpJsonSchemaOrgDraft04Schema | string[];
    };
    enum?: any[];
    type?: SimpleTypes | SimpleTypes[];
    allOf?: HttpJsonSchemaOrgDraft04Schema[];
    anyOf?: HttpJsonSchemaOrgDraft04Schema[];
    oneOf?: HttpJsonSchemaOrgDraft04Schema[];
    not?: HttpJsonSchemaOrgDraft04Schema;
    [k: string]: any;
  };

  type Schema = HttpJsonSchemaOrgDraft04Schema & { $ref?: string };
}