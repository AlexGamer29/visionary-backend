const express = require('express')

const router = express.Router()

const { getObjects, putObject } = require('../../controllers/index.controller')
const deleteObject = require('../../controllers/s3/s3.controller')
const { upload } = require('../../middlewares/index.middleware')

router.get('/list', getObjects)
router.post('/upload', upload.single('file'), putObject)
router.delete('/delete', deleteObject)

module.exports = router
