const getUsers = require("./user/get-users.controller");
const addUser = require("./user/add-user.controller");
const deleteUser = require("./user/delete-user.controller");
const updateUser = require("./user/update-user.controller");
const deleteUsers = require("./user/delete-users.controller");

const { signUp, logIn } = require("./auth/auth.controller");

const download = require("./google-drive/download.controller");
const upload = require("./google-drive/upload.controller");

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    deleteUsers,
    signUp,
    logIn,
    download,
    upload
};