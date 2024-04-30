"use strict";

//!dmbg
const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

var inventorySchema = new Schema(
  {
    inven_product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unKnown" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = { inventory: model(DOCUMENT_NAME, inventorySchema) };
