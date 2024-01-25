const mongoose = require('mongoose')
const schemaType = require('../../types/mongoose')

const uploadFileSchema = new mongoose.Schema(
    {
        userId: {
            type: schemaType.ObjectID,
            required: true,
        },
        originalName: {
            type: schemaType.TypeString,
            required: true,
        },
        encoding: {
            type: schemaType.TypeString,
            required: true,
        },
        mimeType: {
            type: schemaType.TypeString,
            required: true,
        },
        size: {
            type: schemaType.TypeString,
            required: true,
        },
        bucket: {
            type: schemaType.TypeString,
            required: true,
        },
        key: {
            type: schemaType.TypeString,
            required: true,
            unique: true,
        },
        location: {
            type: schemaType.TypeString,
            required: true,
        },
        eTag: {
            type: schemaType.TypeString,
            required: true,
        },
    },
    { timestamps: true },
)

module.exports = uploadFileSchema
