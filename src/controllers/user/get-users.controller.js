const { find } = require("../../helpers");

const getUsers = async (req, res) => {
    try {
        let response = await find("users", {});
        return res.status(200).send({ status: 200, response });
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message });
    }
}

module.exports = getUsers;