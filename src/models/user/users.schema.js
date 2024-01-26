const mongoose = require('mongoose')
const schemaType = require('../../types/mongoose')

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: schemaType.TypeString,
            required: true,
        },
        last_name: {
            type: schemaType.TypeString,
            required: true,
        },
        username: {
            type: schemaType.TypeString,
            required: true,
        },
        email: {
            type: schemaType.TypeString,
            required: true,
            unique: true,
        },
        password: {
            type: schemaType.TypeString,
            required: true,
        },
        resetLink: {
            type: schemaType.TypeString,
            default: '',
        },
    },
    { timestamps: true },
)

module.exports = userSchema
