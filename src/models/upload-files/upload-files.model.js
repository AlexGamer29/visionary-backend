const mongoose = require('mongoose')
const uploadFileSchema = require('./upload-files.schema')

const uploadFile = mongoose.model('upload-files', uploadFileSchema)

module.exports = uploadFile
