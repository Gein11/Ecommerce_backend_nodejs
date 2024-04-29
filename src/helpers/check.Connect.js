'use strict'

const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECONDS = 5000

//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`number of connections: ${numConnection}`)
}

//check over load
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //example maxium number of connections bases on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`)
        console.log(`memory usage: ${memoryUsage / 1024 / 1024} MB`)

        if (numConnection > maxConnections) {
            console.log(`Connection overload detected`)
        }
    }, _SECONDS) //monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad
}