const jwt = require('jsonwebtoken')
const Joi = require('joi')
const signUp = require('./signup/signup.controller')
const logIn = require('./login/login.controller')
const { verifyRefreshToken } = require('../../utils')
const { SECRET } = require('../../config')
const { findOne, deleteDocument } = require('../../helpers')

const schema = Joi.object({
    refreshToken: Joi.string().required(),
})

const getAccessToken = async (req, res) => {
    const { refreshToken } = req.body
    try {
        const validate = await schema.validateAsync(req.body)
        verifyRefreshToken(refreshToken)
            .then(({ tokenDetails }) => {
                const payload = { _id: tokenDetails._id }
                const accessToken = jwt.sign(payload, SECRET, {
                    expiresIn: '15m',
                })
                res.status(200).json({
                    error: false,
                    accessToken,
                    message: 'Access token created successfully',
                })
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

const removeRefreshToken = async (req, res) => {
    const { refreshToken } = req.body

    try {
        // Validate request body
        await schema.validateAsync(req.body)
        // Find the token
        const userToken = await findOne('tokens', { token: refreshToken })
        // If the token doesn't exist, it's already been removed or it never existed
        if (!userToken) {
            return res.status(200).json({
                error: false,
                message: 'Token does not exist or has already been removed.',
            })
        }
        // Delete the token
        await deleteDocument('tokens', { token: refreshToken })
        // Send success response
        return res.status(200).json({
            error: false,
            message: 'Logged out successfully.',
        })
    } catch (e) {
        // Send error response
        return res.status(400).json({ status: 400, message: e.message })
    }
}

module.exports = { signUp, logIn, getAccessToken, removeRefreshToken }
