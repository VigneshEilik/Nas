const express = require("express");
const { verifyToken, requireRole } = require("../middleware/auth");
const { getCohortsByCourse, createCohort } = require("../controllers/cohort.controller");

const router = express.Router();

router.get("/course/:courseId", getCohortsByCourse);
router.post("/", verifyToken, requireRole("CREATOR"), createCohort);

module.exports = router;
