const prisma = require("../lib/prisma");

const getCohortsByCourse = async (req, res) => {
  try {
    const cohorts = await prisma.cohort.findMany({
      where: { courseId: req.params.courseId },
      include: {
        _count: { select: { enrollments: true } }
      },
      orderBy: { startDate: "asc" }
    });

    const now = new Date();
    const data = cohorts.map(cohort => {
      let status = "UPCOMING";
      if (now >= new Date(cohort.startDate) && now <= new Date(cohort.endDate)) status = "ACTIVE";
      if (now > new Date(cohort.endDate)) status = "COMPLETED";
      
      return {
        ...cohort,
        currentStatus: status,
        enrollmentCount: cohort._count.enrollments
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("[cohort.controller]", error);
    return res.status(500).json({ message: "Failed to fetch cohorts" });
  }
};

const createCohort = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.body;
    if (!courseId || !startDate || !endDate) {
      return res.status(400).json({ message: "courseId, startDate and endDate are required" });
    }
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.creatorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
    const cohort = await prisma.cohort.create({
      data: { courseId, startDate: new Date(startDate), endDate: new Date(endDate) }
    });
    return res.status(201).json(cohort);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create cohort" });
  }
};

module.exports = { getCohortsByCourse, createCohort };
