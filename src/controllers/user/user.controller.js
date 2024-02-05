const { getPopulatedData } = require('../../helpers')

const getMe = async (req, res) => {
    const _id = req.user.id
    try {
        const populatedUser = await getPopulatedData(
            'users',
            { _id },
            null,
            null,
        )
        const user = populatedUser[0]
        if (user) {
            user.password = undefined
            user.resetLink = undefined
            res.status(200).send({ status: 200, user })
        }
    } catch (e) {
        res.status(400).send({ status: 400, message: e.message })
    }
}

module.exports = {
    getMe,
}
