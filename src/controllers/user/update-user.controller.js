const Joi = require('joi')
const { updateDocument } = require('../../helpers')

const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    username: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
})

const updateUser = async (req, res) => {
    try {
        const validate = await schema.validateAsync(req.body)
        const user_type_updated = await updateDocument(
            'users',
            { _id: req.params.id },
            req.body,
        )
        return res.status(200).send({ status: 200, user_type_updated })
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

module.exports = updateUser
