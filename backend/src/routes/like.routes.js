const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { toggleLike } = require("../controllers/like.controller");

const router = express.Router();

router.post("/posts/:postId/like", verifyToken, toggleLike);

module.exports = router;
