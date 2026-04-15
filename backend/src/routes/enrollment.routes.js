const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { enrollInCohort, getMyEnrollments } = require("../controllers/enrollment.controller");

const router = express.Router();

router.post("/", verifyToken, enrollInCohort);
router.get("/my", verifyToken, getMyEnrollments);

module.exports = router;
