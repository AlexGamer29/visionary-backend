const { S3Client } = require('@aws-sdk/client-s3')
const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner')
const {
    S3_ENDPOINT,
    S3_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
} = require('..')

const client = new S3Client({
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: S3_REGION,
    forcePathStyle: true,
})

// Now you can use the `s3` object to interact with your custom S3-compatible service
const s3Presigner = new S3RequestPresigner({ client })

module.exports = { client }
