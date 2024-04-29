'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async (key) => {
    // fake IP
    // const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissons: ['0000'] })
    // console.log(newKey)
    const objKey = await apikeyModel.findOne({ key, status: true }).lean()
    return objKey
}

module.exports = {
    findById
}