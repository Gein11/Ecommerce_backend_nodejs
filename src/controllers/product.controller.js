'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const productModel = require("../models/product.model")
const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
class ProductController {
    createProduct = async (req, res, next) => {
      
        new SuccessResponse({
            message: 'Success create product',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success update product',
            metadata: await ProductServiceV2.publishProductByShop( {
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success unpublish product',
            metadata: await ProductServiceV2.unPublishProductByShop( {
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    
    getAllDraftsForShop = async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Success get all draft for shop',
            metadata: await ProductServiceV2.findAllDraftForShop( {
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublicForShop = async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Success get all draft for shop',
            metadata: await ProductServiceV2.findAllPublicForShop( {
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Get List Search Product success',
            metadata: await ProductServiceV2.searchProductByUser( req.params)
        }).send(res)
    }
    findAllProducts= async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Get List All Product success',
            metadata: await ProductServiceV2.findAllProducts( req.query)
        }).send(res)
    }
    findProduct= async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Get Detail Product success',
            metadata: await ProductServiceV2.findProduct( { product_id : req.params.product_id})
        }).send(res)
    }
    updateProduct= async (req, res, next) => {
   
        new SuccessResponse({
            message: 'Update Product success',
            metadata: await ProductServiceV2.updateProduct( req.body.product_type, req.params.productId,
                { ...req.body, product_shop: req.user.userId}
            )
        }).send(res)
    }

}

module.exports = new ProductController()