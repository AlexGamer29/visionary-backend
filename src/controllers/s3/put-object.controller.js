const { client } = require('../../config/s3')

const putObject = async (req, res, next) => {
    try {
        console.log(req.file)
        const data = {}
        if (req.file) {
            data.image = req.file.location
            res.status(200).send({
                status: 200,
                data: {
                    link: data.image,
                },
            })
        } else {
            // This is a non-JPG file, pass control to the next middleware/controller
            res.status(400).send({
                status: 400,
                message: 'No file was uploaded',
            })
        }
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

module.exports = putObject
