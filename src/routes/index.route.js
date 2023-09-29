const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/index.middleware")

const user = require("./user/user.route");
const auth = require("./auth/auth.route");

// AUTH Routes * /api/auth/*
router.use("/auth", auth);
router.use("/user", authenticateJWT, user);

module.exports = router;
