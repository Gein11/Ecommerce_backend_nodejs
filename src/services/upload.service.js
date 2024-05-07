"use strict";

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const cloudinary = require("../configs/config.cloudinary");
const { s3, GetObjectCommand } = require("../configs/config.aws");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const
// upload file use S3Clinet
const ranDomName = () => crypto.randomBytes(16).toString("hex");
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomeImageName = ranDomName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomeImageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const result = await s3.send(command);

    const singedUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomeImageName,
    });
    // getSignedUrl export url to public
    const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error(error);
  }
};
// Upload Cloudinary
const uploadImageFromUrl = async (url) => {
  try {
    const urlImage =
      "https://res.cloudinary.com/dnhkq2f7l/image/upload/v1633660137/ecommerce";

    const folderName = "product/shopId";
    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.error(error);
  }
};
// Upload multiple files
const uploadImageFromLocalFiles = async ({
  files,
  folderName = "product/8409",
}) => {
  try {
    if (!files.length) {
      return;
    }
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          width: 100,
          height: 100,
          format: "jpg",
        }),
      });
    }
    return uploadedUrls;
  } catch (error) {
    console.error(error);
  }
};
// uploadImageFromUrl().catch();
module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
  uploadImageFromLocalFiles,
};
