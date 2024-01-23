const jwt = require('jsonwebtoken')
const { SECRET, REFRESH_SECRET } = require('../config')

const { findOne, deleteDocument, insertNewDocument } = require('../helpers')

const generateTokens = async (user) => {
    try {
        const accessToken = jwt.sign({ id: user._id }, SECRET, {
            expiresIn: '15m',
        })
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
            expiresIn: '7d',
        })

        const userToken = await findOne('tokens', { userId: user._id })
        if (userToken) await deleteDocument('tokens', { userId: user._id })

        await insertNewDocument('tokens', {
            userId: user._id,
            token: refreshToken,
        })
        return Promise.resolve({ accessToken, refreshToken })
    } catch (err) {
        return Promise.reject(err)
    }
}

const verifyRefreshToken = (refreshToken) => {
    const privateKey = REFRESH_SECRET

    return new Promise(async (resolve, reject) => {
        const userToken = await findOne('tokens', { token: refreshToken })
        if (!userToken) {
            return reject({ error: true, message: 'Invalid refresh token' })
        }

        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
            if (err)
                return reject({ error: true, message: 'Invalid refresh token' })
            resolve({
                tokenDetails,
                error: false,
                message: 'Valid refresh token',
            })
        })
    })
}

module.exports = { generateTokens, verifyRefreshToken }
