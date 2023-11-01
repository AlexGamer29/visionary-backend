// LIST all objects
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");

const listObjects = (params) => {
    const command = new ListObjectsV2Command(params);
    return command;
}

module.exports = {
    listObjects
}