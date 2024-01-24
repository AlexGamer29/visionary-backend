const getUsers = require('./user/get-users.controller')
const addUser = require('./user/add-user.controller')
const deleteUser = require('./user/delete-user.controller')
const updateUser = require('./user/update-user.controller')
const deleteUsers = require('./user/delete-users.controller')

const { signUp, logIn } = require('./auth/auth.controller')

const { getObjects, putObject, deleteObject } = require('./s3/s3.controller')

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    deleteUsers,
    signUp,
    logIn,
    getObjects,
    putObject,
    deleteObject
}
