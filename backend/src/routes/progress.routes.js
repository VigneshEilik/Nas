const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { updateLessonProgress, getCourseProgress } = require("../controllers/progress.controller");

const router = express.Router();

router.post("/lessons/:id/progress", verifyToken, updateLessonProgress);
router.get("/progress/:courseId", verifyToken, getCourseProgress);

module.exports = router;
