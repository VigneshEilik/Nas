const prisma = require("../lib/prisma");

const updateLessonProgress = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const { completed } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true }
    });

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Check if user is enrolled in the course this lesson belongs to
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: req.user.id,
        cohort: { courseId: lesson.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Enrollment required to update progress" });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: lessonId
        }
      },
      update: { completed: !!completed },
      create: {
        userId: req.user.id,
        lessonId: lessonId,
        completed: !!completed
      }
    });

    return res.status(200).json(progress);
  } catch (error) {
    console.error("[progress.controller]", error);
    return res.status(500).json({ message: "Failed to update progress" });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user.id,
        lesson: { courseId: courseId }
      }
    });

    return res.status(200).json(progress);
  } catch (error) {
    console.error("[progress.controller]", error);
    return res.status(500).json({ message: "Failed to fetch progress" });
  }
};

module.exports = { updateLessonProgress, getCourseProgress };
