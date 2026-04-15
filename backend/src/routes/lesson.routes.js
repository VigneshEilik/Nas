const express = require("express");
const { verifyToken, requireRole } = require("../middleware/auth");
const { createLesson, updateLesson, deleteLesson } = require("../controllers/lesson.controller");

const router = express.Router();

router.post("/", verifyToken, requireRole("CREATOR"), createLesson);
router.put("/:id", verifyToken, requireRole("CREATOR"), updateLesson);
router.delete("/:id", verifyToken, requireRole("CREATOR"), deleteLesson);

module.exports = router;
