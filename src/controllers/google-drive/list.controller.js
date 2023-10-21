const { listFiles } = require("../../helpers");

const list = async (req, res) => {
    try {
        const data = await listFiles();
        res.status(200).send({ status: 200, data: data});
    } catch (error) {
        res.status(500).send({ status: 500, error: error });
        console.error(error);
    }
};

module.exports = list;
