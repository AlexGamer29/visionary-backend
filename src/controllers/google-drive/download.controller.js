const { downloadFile } = require("../../helpers");

const download = async (req, res) => {
    try {
        const fileId = req.query.fileId;
        const data = await downloadFile(fileId);
        res.status(200).send({ status: 200, data: data});
    } catch (error) {
        res.status(500).send({ status: 500, error: error });
        console.error(error);
    }
};

module.exports = download;
