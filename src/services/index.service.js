const { listObjects, deleteObjectS3 } = require('./s3/s3.service')

module.exports = {
    listObjects,
    deleteObjectS3,
}
