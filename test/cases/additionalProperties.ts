export var schema = {
  "title": "AdditionalProperties",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "additionalProperties": {
    "type": "number"
  }
}

export var types = `type AdditionalProperties = {
  foo?: string;
  [k: string]: number;
};`
