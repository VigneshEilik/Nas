const prisma = require("../lib/prisma");

const getStudentDashboard = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        cohort: {
          include: {
            course: {
              include: { 
                _count: { select: { lessons: true } },
                creator: { select: { id: true, name: true } } 
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });

    // Calculate progress for each enrollment
    const data = await Promise.all(enrollments.map(async (e) => {
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId: req.user.id,
          completed: true,
          lesson: { courseId: e.cohort.courseId }
        }
      });
      
      const totalLessons = e.cohort.course._count.lessons;
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        ...e,
        progressPercent
      };
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("[dashboard.controller]", error);
    return res.status(500).json({ message: "Failed to load student dashboard" });
  }
};

const getCreatorDashboard = async (req, res) => {
  try {
    if (req.user.role !== "CREATOR" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const courses = await prisma.course.findMany({
      where: { creatorId: req.user.id },
      include: {
        _count: {
          select: { lessons: true, posts: true }
        },
        cohorts: {
          include: {
            _count: {
              select: { enrollments: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const data = courses.map((course) => ({
      ...course,
      lessonCount: course._count.lessons,
      postCount: course._count.posts,
      enrollmentCount: course.cohorts.reduce((sum, c) => sum + c._count.enrollments, 0)
    }));
    return res.status(200).json(data);
  } catch (error) {
    console.error("[dashboard.controller]", error);
    return res.status(500).json({ message: "Failed to load creator dashboard" });
  }
};

module.exports = { getStudentDashboard, getCreatorDashboard };
