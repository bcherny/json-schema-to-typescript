const { stringify } = require('querystring');
const { compile } = require('./dist/src');

const schema = {
  "title": "2022 Example Schema",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "61e36b8fc12c4d8fd0842f76"
    }
  }
};

compile(schema).then(ts => console.log(ts));

const schema2 = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Product Export Schema",
  "properties": {
    "products": {
      "type": "array",
      "title": "Products",
      "items": {
        "oneOf": [
          {
            "type": "object",
            "title": "3D Model",
            "properties": {
              "type": {
                "type": "string",
                "title": "Type",
                "constant": "3d_surface_model"
              },
              "description": {
                "type": "string",
                "title": "Description",
                "default": ""
              },
              "status": {
                "type": "string",
                "title": "200",
                "example": "200",
                "description": "...."
              }
            }
          }
        ]
      },
      "minItems": 1
    }
  }
}

compile(schema2).then(ts => console.log(ts));

const unicodeSchema = {
  "type": "object",
  "title": "呵呵",
  "properties": {
    "some_key": {
      "type": "string",
      "title": "哈哈"
    }, 
    "this is 'I can eat glass in Gothic' apparently": {
      "type": "string", 
      "title": "𐌼𐌰𐌲 𐌲𐌻𐌴𐍃 𐌹̈𐍄𐌰𐌽, 𐌽𐌹 𐌼𐌹𐍃 𐍅𐌿 𐌽𐌳𐌰𐌽 𐌱𐍂𐌹𐌲𐌲𐌹𐌸."
    },
    "non ASCII punctuation": {
      "type": "string",
      "title": "他說：「你好!」",
    }
  }
}

compile(unicodeSchema).then(ts => console.log(ts));

const operatorSchema = {
  "type": "object",
  "title": "CD-RW vs. CD+RW",
  "properties": {
    "some_key": {
      "type": "string",
      "title": "Times*(not valid)"
    }
  }
}

compile(operatorSchema).then(ts => console.log(ts));