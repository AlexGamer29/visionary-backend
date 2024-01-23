const express = require('express')

const router = express.Router()

// ROUTES * /api/auth/
const {
    signUp,
    logIn,
    getAccessToken,
    removeRefreshToken,
} = require('../../controllers/index.controller')

// ROUTES * /api/auth/
router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/token', getAccessToken)
router.delete('/token', removeRefreshToken)

module.exports = router
