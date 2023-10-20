const { uploadFile } = require("../../helpers");

const upload = async (req, res) => {
    try {
        const { files } = req;
        for (let f = 0; f < files.length; f += 1) {
            await uploadFile(files[f]);
        }
        res.status(200).send({ status: 200, message: "Files uploaded" });
    } catch (error) {
        res.status(500).send({ status: 500, error: error });
        console.error(error);
    }
};

module.exports = upload;
