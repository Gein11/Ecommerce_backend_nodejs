"use strict";

const { BadRequestError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoodb } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;

    // Check if the discount code has expired
    // if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired!");
    // }

    // Check if the start date is before the end date
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end_date");
    }

    // Look for an existing discount code
    const foundDiscount = await discount
      .find({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_value: value,
      discount_type: type,
      discount_code: code,
      discount_min_order_value: min_order_value || 0,
      discount_max_uses: max_uses,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "alll" ? [] : product_ids,
    });
    return newDiscount;
  }
  static async updateDiscountCode(payload) {}

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoodb(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code not found");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoodb(shopId),
          isPublic: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublic: true,
        },
        limit: +limit, // + convert to number
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  // GetAllDiscountofShop

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["discount_shopId", "__v"],
      model: discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoodb(shopId),
      },
      model: discount,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount code not found");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
      discount_users_used,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new BadRequestError("Discount code is not active");
    }
    if (!discount_max_uses) {
      throw new BadRequestError("Discount code has out");
    }
    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new BadRequestError("Discount code has expired");
    // }
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount require min order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsedDiscount) {
        throw new BadRequestError(`User has used discount code`);
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoodb(shopId),
    });
    return deleted;
  }
  static async cancelDiscountCode({ shopId, codeId }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoodb(shopId),
      },
      model: discount,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount code not found");
    }
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: userId },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}
module.exports = DiscountService;
