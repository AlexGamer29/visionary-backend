const multer = require('multer')
const multerS3 = require('multer-s3')
const { client } = require('../../config/s3')

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb('Error: Allow images only of extensions jpeg|jpg !')
    }
}

// Middleware to check if the uploaded file is an image
const checkImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    if (req?.file?.size === 0) {
        return res.status(400).json({ error: 'Empty file' })
    }

    if (allowedMimeTypes.includes(req.file.mimetype)) {
        next() // File is an image, proceed to the next middleware
    } else {
        // File is not an image, return an error response
        return res.status(400).json({ error: 'Uploaded file is not an image' })
    }
}

const multerS3Config = multerS3({
    s3: client,
    bucket: 'visionary-img',
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.fieldname}_${file.originalname}`
        cb(null, fileName)
    },
})

// Create an S3 storage engine using multer-s3
const upload = multer({
    storage: multerS3Config,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
})

module.exports = { upload }
