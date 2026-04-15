const adminService = require("../services/admin.service");

const getAllUsers = async (req, res) => {
  const { page, limit, role, search } = req.query;
  const data = await adminService.getUsers({ page, limit, role, search });
  res.status(200).json(data);
};

const getUser = async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

const handleUserBan = async (req, res) => {
  const user = await adminService.toggleUserBan(req.params.id);
  res.status(200).json({ 
    message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
    user 
  });
};

const handleUserDelete = async (req, res) => {
  await adminService.deleteUser(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
};

// --- COURSE MODERATION ---

const getCourses = async (req, res) => {
  const { page, limit, status } = req.query;
  const courses = await adminService.getPendingCourses({ page, limit, status });
  res.status(200).json(courses);
};

const handleCourseStatus = async (req, res) => {
  const { status } = req.body;
  const course = await adminService.updateCourseStatus(req.params.id, status);
  res.status(200).json({ message: `Course ${status.toLowerCase()} successfully`, course });
};

// --- COMMUNITY MODERATION ---

const getPostsList = async (req, res) => {
  const { page, limit } = req.query;
  const posts = await adminService.getAdminPosts({ page, limit });
  res.status(200).json(posts);
};

const handlePostDelete = async (req, res) => {
  await adminService.deleteAdminPost(req.params.id);
  res.status(200).json({ message: "Post deleted successfully" });
};

const handleCommentDelete = async (req, res) => {
  await adminService.deleteAdminComment(req.params.id);
  res.status(200).json({ message: "Comment deleted successfully" });
};

// --- ANALYTICS ---

const getAnalytics = async (req, res) => {
  const data = await adminService.getPlatformAnalytics();
  res.status(200).json(data);
};

module.exports = {
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
};
