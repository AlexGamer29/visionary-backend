const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadMiddleware = multer();

const { upload, download, list } = require("../../controllers/index.controller")

// ROUTES * /api/file/
router.get("/download", download);
router.post("/upload", uploadMiddleware.any(), upload);
router.get("/list", list);

module.exports = router;
