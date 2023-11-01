const express = require("express");
const router = express.Router();

const { getObjects } = require("../../controllers/index.controller")

router.get("/list", getObjects);

module.exports = router;
