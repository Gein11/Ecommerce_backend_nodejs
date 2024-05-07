"use strict";

//!dmbg
const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var CartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, default: [], required: true },
    /*
    [{
        productId,
        shopId,
        quantity,
        price,
        name
    }]
    */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      createddAt: "createdOn",
      updateddAt: "modifiedOn",
    },
  }
);

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, CartSchema),
};
