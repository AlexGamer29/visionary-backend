const authenticateJWT = require('./token-verification/token-verification.middleware')
const { upload } = require('./s3-upload/s3-upload.middleware')

module.exports = {
    authenticateJWT,
    upload,
}
