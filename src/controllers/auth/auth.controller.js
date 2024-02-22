const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const path = require('path')
const Joi = require('joi')
const { verifyRefreshToken, generateTokens } = require('../../utils')
const {
    SECRET,
    RESET_SECRET,
    HOST_NODEMAILER,
    PORT_NODEMAILER,
    USER_NODEMAILER,
    PASS_NODEMAILER,
} = require('../../config')
const {
    findOne,
    deleteDocument,
    getPopulatedData,
    insertNewDocument,
    updateDocument,
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

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
})

const updatePasswordSchema = Joi.object({
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
                    status: 404,
                    message: 'Invalid Email or Password!',
                })
            }
            user.password = undefined
            const token = jwt.sign({ id: user._id }, SECRET)
            const { accessToken, refreshToken } = await generateTokens(user)
            res.status(200).send({
                status: 200,
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

const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const validate = await forgotPasswordSchema.validateAsync(req.body)

        const check_user_exist = await findOne('users', { email })
        if (check_user_exist) {
            const resetToken = jwt.sign(
                { id: check_user_exist._id },
                RESET_SECRET,
                { expiresIn: '1h' },
            )
            const transporter = nodemailer.createTransport({
                host: HOST_NODEMAILER,
                port: PORT_NODEMAILER,
                secure: true,
                auth: {
                    user: USER_NODEMAILER,
                    pass: PASS_NODEMAILER,
                },
            })

            const data = {
                from: 'noreply@hehe.com',
                to: email,
                subject: 'Reset Account Password',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <a href="${process.env.CLIENT_URL}/api/auth/reset-password/?token=${resetToken}">Click here</a>
                `,
            }

            const update = await updateDocument(
                'users',
                { email },
                { resetLink: resetToken },
            )

            if (update) {
                transporter.sendMail(data, function (error, body) {
                    if (error) {
                        return res.status(400).json({ error: error.message })
                    }
                    return res.status(200).json({
                        message:
                            'Email has been sent, please follow the instructions',
                    })
                })
            } else {
                return res
                    .status(400)
                    .json({ error: 'Reset password link error' })
            }
        }
    } catch (e) {
        return res.status(400).send({ status: 400, message: e.message })
    }
}

const updatePassword = async (req, res) => {
    const { token } = req.query
    const { password } = req.body

    try {
        const validate = await updatePasswordSchema.validateAsync(req.body)

        jwt.verify(token, RESET_SECRET, async function (error, decodedData) {
            if (error) {
                return res
                    .status(400)
                    .json({ error: 'Incorrect token or it is expired' })
            }

            try {
                const foundUser = await findOne('users', { resetLink: token })

                if (!foundUser) {
                    return res.status(400).json({
                        error: 'User with this token does not exist or one-time token is expired',
                    })
                }

                const updatePassword = {
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                    resetLink: '',
                }

                const updateUser = await updateDocument(
                    'users',
                    { email: foundUser.email },
                    updatePassword,
                )

                if (!updateUser) {
                    return res
                        .status(400)
                        .json({ error: 'Reset password error' })
                }

                return res
                    .status(200)
                    .json({ message: 'Your password has been changed' })
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    e: 'Internal server error',
                    message: e.message,
                })
            }
        })
    } catch (e) {
        return res.status(400).send({ status: 400, message: e.message })
    }
}

const renderForgotPassword = async (req, res) => {
    return res.sendFile(
        path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'public',
            'forgot-password.html',
        ),
    )
}

const renderResetPassword = async (req, res) => {
    return res.sendFile(
        path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'public',
            'reset-password.html',
        ),
    )
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
                res.status(500).send({ status: 500, err })
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

module.exports = {
    signUp,
    logIn,
    forgotPassword,
    updatePassword,
    renderForgotPassword,
    renderResetPassword,
    getAccessToken,
    removeRefreshToken,
}
