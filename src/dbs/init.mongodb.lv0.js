'use strict'
const mongoose = require('mongoose')

const connectString = `mongodb://127.0.0.1:27017/ShopDEV`


mongoose.connect(connectString).then(_ => console.log(`connected to mongodb`))
    .catch(err => console.log(`connect error`))

//dev
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose
