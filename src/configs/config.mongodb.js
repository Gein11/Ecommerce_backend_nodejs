'use strict'

//lv0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }

//lv1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },
    db: {
        host: process.env.DEV_DB_HOST || '127.0.0.1',
        port: process.env.DEV_DB_PORT || 27018,
        name: process.env.DEV_DB_NAME || 'ShopDEV',
        user: process.env.DEV_DB_USER || 'root',
        password: process.env.DEV_DB_PASSWORD || '123456',
    }
}


const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || '127.0.0.1',
        port: process.env.PRO_DB_PORT || 27018,
        name: process.env.PRO_DB_NAME || 'shopPRO'
    }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]