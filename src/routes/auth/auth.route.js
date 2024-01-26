const express = require('express')

const router = express.Router()

// ROUTES * /api/auth/
const {
    signUp,
    logIn,
    forgotPassword,
    updatePassword,
    renderForgotPassword,
    renderResetPassword,
    getAccessToken,
    removeRefreshToken,
} = require('../../controllers/index.controller')

// ROUTES * /api/auth/
router.post('/signup', signUp)
router.post('/login', logIn)
router
    .get('/forgot-password', renderForgotPassword)
    .put('/forgot-password', forgotPassword)
router
    .get('/reset-password', renderResetPassword)
    .put('/reset-password', updatePassword)
router.post('/token', getAccessToken)
router.delete('/token', removeRefreshToken)

module.exports = router
