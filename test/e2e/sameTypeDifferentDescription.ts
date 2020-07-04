export const options = {resolve: false}

export const input = {
  title: "Offer",
  description: "An offer",
  type: "object",
  additionalProperties: false,
  properties: {
    price: {
      description: "Price excl. VAT",
      "$ref": "#/definitions/Price"
    },
    priceInclVAT: {
      description: "Price incl. VAT",
      "$ref": "#/definitions/Price"
    }
  },
  definitions: {
    Price: {
      title: "Price",
      description: "A price",
      type: "object",
      additionalProperties: false,
      properties: {
        value: {
          description: "Price as number",
          type: "number"
        },
        text: {
          description: "Price as string",
          type: "string"
        }
      }
    }
  }
}
