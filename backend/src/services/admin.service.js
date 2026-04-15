const prisma = require("../lib/prisma");

const getUsers = async ({ page = 1, limit = 10, role, search }) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: { courses: true, enrollments: true, posts: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: { courses: true, enrollments: true, posts: true, comments: true }
      }
    }
  });
};

const toggleUserBan = async (id) => {
  const user = await prisma.user.findUnique({ where: { id }, select: { isBanned: true } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data: { isBanned: !user.isBanned }
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};

// --- COURSE MODERATION ---

const getPendingCourses = async ({ page = 1, limit = 10, status = "PENDING" }) => {
  const skip = (page - 1) * limit;
  return await prisma.course.findMany({
    where: { status },
    skip,
    take: Number(limit),
    include: { creator: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });
};

const updateCourseStatus = async (id, status) => {
  return await prisma.course.update({
    where: { id },
    data: { status }
  });
};

// --- COMMUNITY MODERATION ---

const getAdminPosts = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  return await prisma.post.findMany({
    skip,
    take: Number(limit),
    include: { author: { select: { name: true } }, course: { select: { title: true } } },
    orderBy: { createdAt: "desc" }
  });
};

const deleteAdminPost = async (id) => {
  return await prisma.post.delete({ where: { id } });
};

const deleteAdminComment = async (id) => {
  return await prisma.comment.delete({ where: { id } });
};

// --- ANALYTICS ---

const getPlatformAnalytics = async () => {
  const [
    totalUsers,
    totalStudents,
    totalCreators,
    totalCourses,
    totalEnrollments,
    activeCohorts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.cohort.count({ where: { status: "ACTIVE" } })
  ]);

  return {
    totalUsers,
    totalStudents,
    totalCreators,
    totalCourses,
    totalEnrollments,
    activeCohorts
  };
};

module.exports = {
  getUsers,
  getUserById,
  toggleUserBan,
  deleteUser,
  getPendingCourses,
  updateCourseStatus,
  getAdminPosts,
  deleteAdminPost,
  deleteAdminComment,
  getPlatformAnalytics
};
