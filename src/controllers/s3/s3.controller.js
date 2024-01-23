const { deleteObjectS3 } = require('../../services/index.service')
const { client } = require('../../config/s3')

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

module.exports = deleteObject
