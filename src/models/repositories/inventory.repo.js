"use strict"; // giảm rò rỉ bộ nhớ trong nodeJs
const { inventory } = require("../inventory.model");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inven_product_id: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};
module.exports = { insertInventory };
