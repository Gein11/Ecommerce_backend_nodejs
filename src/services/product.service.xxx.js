"use strict";
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  findAllDraftForShop,
  findAllPublicForShop,
  publishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { pushNotificationToSystem } = require("./notification.service");
class ProductFactory {
  static productRegister = {};
  static RegisterProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);
    return new productClass(payload).updateProduct(productId);
  }
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublicForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublic: true };
    return await findAllPublicForShop({ query, limit, skip });
  }
  // Search ALl Product
  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublic: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  // POST
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}
class Product {
  constructor({
    product_name,
    product_price,
    product_thumb,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
      pushNotificationToSystem({
        type: "SHOP_001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: newProduct.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    return newProduct;
  }
  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ product_id, bodyUpdate, model: product });
  }
}
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Clothing not created");
    const newProduct = await super.createProduct();
    return newProduct;
  }
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objectParams = removeUndefinedObject(updateNest);
    if (objectParams.product_attributes) {
      updateProductById(productId, objectParams, clothing);
    }
    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Electronic not created");

    const newProduct = await super.createProduct(newElectronic._id);
    return newProduct;
  }
  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Furniture not created");

    const newProduct = await super.createProduct(newFurniture._id);
    return newProduct;
  }
}

ProductFactory.RegisterProductType("Clothing", Clothing);
ProductFactory.RegisterProductType("Electronic", Electronic);
ProductFactory.RegisterProductType("Furniture", Furniture);
module.exports = ProductFactory;
