const { update } = require("lodash");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongoodb,
} = require("../../utils");
const findAllDraftForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublicForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .lean();
  return results;
};
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};
const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};
const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean() // use lean() to remove  __v: 0,save: function(){ /* function code */ },,...
    .exec(); // đại diện cho chúng ta biết sử dụng async await của mongose
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }
  foundShop.isDraft = false;
  foundShop.isPublic = true;
  await foundShop.save();
  return foundShop;
};
const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }
  foundShop.isDraft = true;
  foundShop.isPublic = false;
  await foundShop.save();
  return foundShop;
};
const updateProductById = async ({
  product_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
  // {new: true}  return the new version of the document instead of the old version
};
const getProductById = async (productId) => {
  return await product
    .findOne({ _id: convertToObjectIdMongoodb(productId) })
    .lean();
};
module.exports = {
  findAllDraftForShop,
  findAllPublicForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findProduct,
  updateProductById,
  getProductById,
  findAllProducts,
};
