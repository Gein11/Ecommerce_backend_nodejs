"use strict";

const express = require("express");
const { apiKey, permisson } = require("../auth/checkAuth");
const router = express.Router();

const { pushToLogDiscord } = require("../middlewares/index");
router.use(pushToLogDiscord);

//check apiKey
router.use(apiKey);

//checkPermisson
router.use(permisson("0000"));

router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/cart", require("./cart"));

router.use("/v1/api", require("./access"));

router.get("/checkstatus", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to nodejs",
  });
});

module.exports = router;
