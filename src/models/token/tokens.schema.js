const mongoose = require('mongoose')
const schemaType = require('../../types/mongoose')

const tokenSchema = new mongoose.Schema(
    {
        userId: { type: schemaType.ObjectID, required: true },
        token: { type: schemaType.TypeString, required: true },
        createdAt: {
            type: schemaType.TypeDate,
            default: Date.now,
            // expires: 10,
            // expires: 30 * 86400,
        },
    },
    { timestamps: true },
)

module.exports = tokenSchema
