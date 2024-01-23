const getUsers = require('./user/get-users.controller')
const addUser = require('./user/add-user.controller')
const deleteUser = require('./user/delete-user.controller')
const updateUser = require('./user/update-user.controller')
const deleteUsers = require('./user/delete-users.controller')

const getObjects = require('./s3/get-objects.controller')
const putObject = require('./s3/put-object.controller')
const {
    signUp,
    logIn,
    getAccessToken,
    removeRefreshToken,
} = require('./auth/auth.controller')

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
    getAccessToken,
    removeRefreshToken,
}
