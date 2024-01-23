const mongoose = require('mongoose')
const tokenSchema = require('./tokens.schema')

const token = mongoose.model('tokens', tokenSchema)

module.exports = token
