const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { insertNewDocument, findOne } = require("../../../helpers");
const { SECRET } = require("../../../config");


const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
});

const signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const validate = await schema.validateAsync(req.body);

        const check_user_exist = await findOne("users", { email });
        if (check_user_exist) {
            return res
                .status(404)
                .send({ status: 404, message: "User already exist!" });
        }

        const new_user = {
            ...req.body,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        };
        const user = await insertNewDocument("users", new_user);
        let token = jwt.sign({ id: new_user._id }, SECRET);
        user.password = undefined;
        return res.status(200).send({ status: 200, user, token });
    } catch (e) {
        return res.status(400).send({ status: 400, message: e.message });
    }
};

module.exports = signUp;
