"use strict";
const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3,
} = require("../services/upload.service");

class UploadController {
  //new
  uploadImageUrl = async (req, res, next) => {
    //new
    new SuccessResponse({
      message: "uploadImageUrl Success",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };
  uploadImageThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "uploadImageUrl Success",
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
  uploadImageThumbFromLocalFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "uploadImageUrl Success",
      metadata: await uploadImageFromLocalFiles({
        files,
      }),
    }).send(res);
  };
  uploadImageThumbS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "uploadImageUrl Success",
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
