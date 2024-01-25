const { ObjectId } = require('mongodb')
const { deleteObjectS3 } = require('../../services/index.service')
const { client } = require('../../config/s3')
const { insertNewDocument } = require('../../helpers')

const getObjects = async (req, res) => {
    try {
        const params = {
            Bucket: 'visionary-img',
        }
        const command = listObjects(params)
        client
            .send(command)
            .then((data) => res.status(200).send({ status: 200, data }))
            .catch((err) => res.status(500).send({ status: 200, err }))
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

const putObject = async (req, res, next) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).send({
                status: 400,
                message: req.fileValidationError,
            })
        }
        let data = {}
        if (req.file) {
            data = req.file
            const uploadFile = {
                userId: new ObjectId(req.user.id),
                originalName: data.originalname,
                encoding: data.encoding,
                mimeType: data.mimetype,
                size: data.size,
                bucket: data.bucket,
                key: data.key,
                location: data.location,
                eTag: data.etag,
            }
            await insertNewDocument('updateFile', uploadFile)
            res.status(200).send({
                status: 200,
                data: {
                    link: data.location,
                },
            })
        } else {
            // This is a non-JPG file, pass control to the next middleware/controller
            res.status(500).send({
                status: 500,
                message: 'No file was uploaded',
            })
        }
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

const deleteObject = async (req, res, next) => {
    try {
        const { key } = req.query

        const params = {
            Bucket: 'visionary-img',
            Key: key,
        }
        const command = deleteObjectS3(params)
        client
            .send(command)
            .then((data) => res.status(200).send({ status: 200, data }))
            .catch((err) => res.status(500).send({ status: 200, err }))
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

module.exports = { getObjects, putObject, deleteObject }
