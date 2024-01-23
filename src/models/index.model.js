const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose

db.users = require('./user/users.model')
db.tokens = require('./token/tokens.model')

module.exports = db
