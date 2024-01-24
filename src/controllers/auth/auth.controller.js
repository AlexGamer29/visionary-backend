const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const { verifyRefreshToken, generateTokens } = require('../../utils')
const { SECRET } = require('../../config')
const {
    findOne,
    deleteDocument,
    getPopulatedData,
    insertNewDocument,
} = require('../../helpers')

const logInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
})

const signUpSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
})

const getAccessTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

const logIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const validate = await logInSchema.validateAsync(req.body)
        const populatedUser = await getPopulatedData(
            'users',
            { email },
            null,
            null,
        )
        const user = populatedUser[0]
        if (user) {
            const passwordIsValid = bcrypt.compareSync(password, user.password)
            if (!passwordIsValid) {
                return res.status(404).send({
                    status: 400,
                    message: 'Invalid Email or Password!',
                })
            }
            user.password = undefined
            const token = jwt.sign({ id: user._id }, SECRET)
            const { accessToken, refreshToken } = await generateTokens(user)
            res.status(200).send({
                status: 200,
                user,
                accessToken,
                refreshToken,
            })
        } else {
            return res
                .status(404)
                .send({ status: 404, message: 'User does not exist!' })
        }
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

const signUp = async (req, res) => {
    const { email, password } = req.body
    try {
        const validate = await signUpSchema.validateAsync(req.body)

        const check_user_exist = await findOne('users', { email })
        if (check_user_exist) {
            return res
                .status(404)
                .send({ status: 404, message: 'User already exist!' })
        }

        const new_user = {
            ...req.body,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        }
        const user = await insertNewDocument('users', new_user)
        const token = jwt.sign({ id: new_user._id }, SECRET)
        user.password = undefined
        return res.status(200).send({ status: 200, user, token })
    } catch (e) {
        return res.status(400).send({ status: 400, message: e.message })
    }
}

const getAccessToken = async (req, res) => {
    const { refreshToken } = req.body
    try {
        const validate = await getAccessTokenSchema.validateAsync(req.body)
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
