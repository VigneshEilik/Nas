const express = require("express");
const { verifyToken, requireEnrollment } = require("../middleware/auth");
const { getPosts, createPost, getComments, createComment, toggleLike } = require("../controllers/community.controller");

const router = express.Router();

// For getting posts, we check if the user is enrolled in the course provided in query
router.get("/posts", verifyToken, requireEnrollment("courseId"), getPosts);

// Only enrolled users can create posts in a course
router.post("/posts", verifyToken, requireEnrollment("courseId"), createPost);

// Comments also require enrollment. 
// Note: Verification details for post->courseId will be handled in the controller or a refined middleware.
// For now, we apply basic auth.
router.get("/posts/:id/comments", verifyToken, getComments);
router.post("/posts/:id/comments", verifyToken, createComment);

module.exports = router;
