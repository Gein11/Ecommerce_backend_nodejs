"use strict";

const DiscountService = require("../services/discount.service");
const { CREATED, SuccessResponse } = require("../core/success.response");
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Success! Discount code created successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Success! Code found!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: "Success! Code found!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Success! getAllDiscountCodesWithProduct!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
