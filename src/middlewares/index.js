"use strict";

const Logger = require("../logger/discord.logv2");

const pushToLogDiscord = async (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      title: `Method ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl} `,
    });
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
module.exports = { pushToLogDiscord };
