const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getStudentDashboard, getCreatorDashboard } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/student", verifyToken, getStudentDashboard);
router.get("/creator", verifyToken, getCreatorDashboard);

module.exports = router;
