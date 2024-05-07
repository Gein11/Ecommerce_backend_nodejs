"use strict";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = cloudinary;
