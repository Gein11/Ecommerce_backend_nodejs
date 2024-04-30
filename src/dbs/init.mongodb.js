'use strict'

const mongoose = require('mongoose')
const { db: { host, name, port ,user,password} } = require('../configs/config.mongodb')
const connectString = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`
const { countConnect } = require('../helpers/check.Connect')

console.log(`connect string: ${connectString}`)
class Database {
    constructor() {
        this.connect();
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true),
                mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log('connected to mongodb current version', countConnect())
        })
        .catch(err => console.log('error connect ',err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb