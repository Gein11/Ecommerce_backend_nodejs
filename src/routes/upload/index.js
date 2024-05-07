"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/config.multer");
const router = express.Router();

// router.use(authenticationV2);
router.post("/product", asyncHandler(uploadController.uploadImageUrl));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImageThumb)
);
router.post(
  "/product/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadController.uploadImageThumbFromLocalFiles)
); // max 3 files

router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageThumbS3)
); // memory has buffer
module.exports = router;
