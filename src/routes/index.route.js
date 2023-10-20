const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/index.middleware")

const user = require("./user/user.route");
const auth = require("./auth/auth.route");
const file = require("./file/file.route");

// AUTH Routes * /api/auth/*
router.use("/auth", auth);
router.use("/user", authenticateJWT, user);
router.use("/file", authenticateJWT, file);

module.exports = router;
