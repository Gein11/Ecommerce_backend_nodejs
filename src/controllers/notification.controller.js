"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const { listNotificationByUser } = require("../services/notification.service");
class CommentController {
  listNotifyByuser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list notification by user successfully",
      metadata: await listNotificationByUser(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
