var env = process.env.NODE_ENV || 'development';
module.exports = require('./config.json')[env];