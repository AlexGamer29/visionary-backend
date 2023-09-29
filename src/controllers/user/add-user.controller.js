const { insertNewDocument } = require("../../helpers");
const Joi = require("joi");

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const addUser = async (req, res) => {
  try {
    const validate = await schema.validateAsync(req.body);
    const user_type = await insertNewDocument("users", req.body);
    return res.status(200).send({ status: 200, user_type });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = addUser;