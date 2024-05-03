"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const notifyController = require("../../controllers/notification.controller");
const router = express.Router();

router.use(authenticationV2);
router.get("", asyncHandler(notifyController.listNotifyByuser));

module.exports = router;
