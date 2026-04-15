const express = require("express");
const { verifyToken, requireRole, requireEnrollment } = require("../middleware/auth");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/course.controller");

const router = express.Router();

router.get("/", getCourses);

// Publicly viewable course details
router.get("/:id", getCourseById);

// Specific "Learn" view strictly for enrolled students
router.get("/:id/learn", verifyToken, requireEnrollment("id"), getCourseById);

router.post("/", verifyToken, requireRole("CREATOR"), createCourse);
router.put("/:id", verifyToken, requireRole("CREATOR"), updateCourse);
router.delete("/:id", verifyToken, requireRole("CREATOR"), deleteCourse);

module.exports = router;
