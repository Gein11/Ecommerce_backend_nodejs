'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication,authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/get-all', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/un-publish/:id', asyncHandler(productController.unPublishProductByShop))
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

router.get('/public/all', asyncHandler(productController.getAllPublicForShop))
module.exports = router