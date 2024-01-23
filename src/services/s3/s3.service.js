const {
    ListObjectsV2Command,
    DeleteObjectCommand,
} = require('@aws-sdk/client-s3')

const listObjects = (params) => {
    const command = new ListObjectsV2Command(params)
    return command
}

const deleteObjectS3 = (params) => {
    const command = new DeleteObjectCommand(params)
    return command
}

module.exports = {
    listObjects,
    deleteObjectS3,
}
