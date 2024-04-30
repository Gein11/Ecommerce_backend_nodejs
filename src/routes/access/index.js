'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication,authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

//SignUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
//login
router.post('/shop/login', asyncHandler(accessController.login))
router.use(authenticationV2)
//logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))
/////Authentication


module.exports = router