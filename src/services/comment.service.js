"use strict";

const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const Comment = require("../models/comment.model");
const { findProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoodb } = require("../utils");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productID: productId,
      comment_userID: userId,
      comment_content: content,
      comment_parentCommentID: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentCommnet = await Comment.findById(parentCommentId);

      if (!parentCommnet) {
        throw new NotFoundError("Parent comment not found");
      }

      rightValue = parentCommnet.comment_right;

      await Comment.updateMany(
        {
          comment_productID: convertToObjectIdMongoodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productID: convertToObjectIdMongoodb(productId),
          comment_left: { $gte: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne({
        comment_productID: convertToObjectIdMongoodb(productId),
      }).sort({ comment_rightValue: -1 });
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }
  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    console.log("productId", productId);
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comment = Comment.find({
        comment_productID: convertToObjectIdMongoodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentID: 1,
        })
        .sort({
          comment_left: 1,
        });
      console.log("commentcommentcomment", comment);
      return comment;
    }

    const comment = Comment.find({
      comment_productID: convertToObjectIdMongoodb(productId),
      comment_parentID: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentID: 1,
      })
      .sort({
        comment_left: 1,
      });
    return comment;
  }
  static async deleteComments({ commentId, productId }) {
    const foundProduct = findProduct(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");
    const lefValue = comment.comment_left;
    const rightValue = comment.comment_right;
    const width = rightValue - lefValue + 1;

    await commentModel.deleteMany({
      comment_productID: convertToObjectIdMongoodb(productId),
      comment_left: { $gte: lefValue, $lte: rightValue },
    });
    await commentModel.updateMany(
      {
        comment_productID: convertToObjectIdMongoodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await commentModel.updateMany(
      {
        comment_productID: convertToObjectIdMongoodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );
    return true;
  }
}
module.exports = CommentService;
