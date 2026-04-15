const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  return res.status(200).json({ url: req.file.path });
});

module.exports = router;
