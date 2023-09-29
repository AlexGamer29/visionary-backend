const { deleteDocuments } = require("../../helpers");

const deleteUsers = async (req, res) => {
    try {
        const deleteQuery = {};
        let response = await deleteDocuments("users", deleteQuery);
        return res.status(200).send({ status: 200, response });
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message });
    }
};

module.exports = deleteUsers;
