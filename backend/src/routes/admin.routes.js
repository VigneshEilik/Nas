const express = require("express");
const { verifyToken, requireRole } = require("../middleware/auth");
const { 
  getAllUsers,
  getUser, 
  handleUserBan, 
  handleUserDelete,
  getCourses,
  handleCourseStatus,
  getPostsList,
  handlePostDelete,
  handleCommentDelete,
  getAnalytics 
} = require("../controllers/admin.controller");

const router = express.Router();

// All routes here are globally protected by ADMIN role
router.use(verifyToken);
router.use(requireRole("ADMIN"));

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/ban", handleUserBan);
router.delete("/users/:id", handleUserDelete);

// Course Moderation
router.get("/courses", getCourses);
router.patch("/courses/:id/status", handleCourseStatus);

// Community Moderation
router.get("/posts", getPostsList);
router.delete("/posts/:id", handlePostDelete);
router.delete("/comments/:id", handleCommentDelete);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router;
