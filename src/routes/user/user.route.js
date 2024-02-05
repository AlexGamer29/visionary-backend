const express = require('express')

const router = express.Router()

const {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    deleteUsers,
    getMe,
} = require('../../controllers/index.controller')

// ROUTES * /api/user/
router.get('/me', getMe)
router.get('/get-users', getUsers)
router.post('/add-user', addUser)
router.delete('/delete-user', deleteUser)
router.put('/update-user/:id', updateUser)
router.delete('/delete-users', deleteUsers)

module.exports = router
