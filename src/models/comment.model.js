"use strict";
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
  {
    comment_productID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    comment_userID: {
      type: Number,
      default: 1,
    },
    comment_content: {
      type: String,
      default: "text",
    },
    comment_parentID: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, commentSchema);
