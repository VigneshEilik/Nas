const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is banned (Security hit on every request as requested)
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { isBanned: true, role: true } });
    if (!user || user.isBanned) {
      return res.status(403).json({ message: "Access denied. User is banned or does not exist." });
    }

    req.user = { ...decoded, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  return next();
};

const requireEnrollment = (paramName = "id") => async (req, res, next) => {
  let courseId = req.params[paramName] || req.query[paramName] || req.body[paramName];
  const postId = req.params.postId || req.query.postId || req.body.postId || (paramName === "id" && req.params.id);

  if (!courseId && postId) {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { courseId: true } });
    if (post) courseId = post.courseId;
  }

  // If no courseId is associated, we allow it (global community) or deny? 
  // User says: Community APIs (course-based). So we require courseId.
  if (!courseId) {
    return next(); // or return 400 if strictly course-based. Let's allow for now if no courseId.
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: req.user.id,
      cohort: {
        courseId: courseId
      }
    }
  });

  if (!enrollment) {
    return res.status(403).json({ message: "Enrollment required to access this content" });
  }

  return next();
};

module.exports = { verifyToken, requireRole, requireEnrollment };
