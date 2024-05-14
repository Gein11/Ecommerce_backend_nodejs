"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createComment,
  getCommentsByParentId,
  deleteComments,
} = require("../services/comment.service");
class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Comment created successfully",
      metadata: await createComment(req.body),
    }).send(res);
  };
  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete comment successfully",
      metadata: await deleteComments(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Comment List successfully",
      metadata: await getCommentsByParentId(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
