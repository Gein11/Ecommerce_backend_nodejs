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

const reservationInventory = async ({ productId, quantity, cartId }) => {
  //tru so luong dat hang trong kho
  const query = ({
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    }.updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    }),
    options = { upsert: true, new: true };
  return await inventory.updateOne(query, update, options);
};

module.exports = { insertInventory, reservationInventory };
