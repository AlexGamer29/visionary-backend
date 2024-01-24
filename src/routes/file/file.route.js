const express = require('express')

const router = express.Router()

const {
    getObjects,
    putObject,
    deleteObject,
} = require('../../controllers/index.controller')
const { upload } = require('../../middlewares/index.middleware')

router.get('/list', getObjects)
router.post('/upload', upload.single('file'), putObject)
router.delete('/delete', deleteObject)

module.exports = router
