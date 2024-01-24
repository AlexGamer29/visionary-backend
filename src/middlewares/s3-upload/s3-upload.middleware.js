const multer = require('multer')
const multerS3 = require('multer-s3')
const { client } = require('../../config/s3')

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        req.fileValidationError =
            'Allow images only of extensions jpeg|jpg|png|gif'
        cb(null, false)
    }
}

const multerS3Config = multerS3({
    s3: client,
    bucket: 'visionary-img',
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`
        cb(null, fileName)
    },
})

// Create an S3 storage engine using multer-s3
const upload = multer({
    storage: multerS3Config,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
})

// Custom error handler middleware for MulterError
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 400,
            message: err.message,
        })
    }
    next(err)
}

module.exports = { upload, handleMulterError }
