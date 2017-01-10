// var dbConfig = require('../config/database.js')
require('winston-mongodb').MongoDB

// configure logging
var winston = require('winston')
winston.add(winston.transports.MongoDB, {
    db: process.env.MONGO_DB,
    storeHost: true,
    handleExceptions: true,
    exitOnError: false
})

module.exports.error = function (err, req) {
    if (!err) return

    var meta = {}

    if (req) {
        if (req.user && req.user._id)
            meta.userId = req.user._id
        meta.app = req.app
        meta.url = req.originalUrl
    }

    if (err instanceof Error) {
        meta.stackTrace = err.stack
        winston.error(err.message, ' ', meta)
    } else {
        winston.error(err, ' ', meta)
    }
}

module.exports.info = function (message) {
    winston.info(message)
}