const {product , electronic , clothing, furniture} = require("../models/product.model");
const { BadRequestError, ForbiddenError } = require('../core/error.response');
class ProductFactory{
    static createProduct(type, payload){
        switch(type){
        case 'Clothing':
            return new Clothing(payload).createProduct()
        case 'Electronic':
            console.log("payload",payload);
          return new Electronic(payload).createProduct()
        //   case 'Furniture':
        //     return new Furniture(payload).createProduct()
        default:
            throw new BadRequestError(`Invalid product type ${type}`)
        }
    }

}
class Product{
    constructor({product_name, product_price, product_thumb, product_description, product_quantity, product_type, product_shop, product_attributes}) {
        this.product_name = product_name;
        this.product_price = product_price;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    async createProduct(product_id){
        return await product.create({...this,_id: product_id})
    }
}
class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes);
        if(!newClothing) throw new BadRequestError('Clothing not created');
        const newProduct = await super.createProduct();
        return newProduct;
    }
}
class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronic) throw new BadRequestError('Electronic not created');
      
        const newProduct = await super.createProduct(newElectronic._id)
        return newProduct;
    }
}
module.exports = ProductFactory;