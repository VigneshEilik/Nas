const prisma = require("../lib/prisma");
const { sendEnrollmentEmail } = require("../services/email.service");

const enrollInCohort = async (req, res) => {
  try {
    const { cohortId } = req.body;
    if (!cohortId) return res.status(400).json({ message: "cohortId is required" });
    const cohort = await prisma.cohort.findUnique({ where: { id: cohortId } });
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });

    const existing = await prisma.enrollment.findUnique({
      where: { userId_cohortId: { userId: req.user.id, cohortId } }
    });
    if (existing) return res.status(409).json({ message: "Already enrolled in this cohort" });

    const enrollment = await prisma.enrollment.create({
      data: { cohortId, userId: req.user.id },
      include: { cohort: { include: { course: true } } }
    });

    // Send confirmation
    await sendEnrollmentEmail(req.user.email, enrollment.cohort.course.title);

    return res.status(201).json(enrollment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to enroll in cohort" });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        cohort: {
          include: {
            course: true
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });
    return res.status(200).json(enrollments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

module.exports = { enrollInCohort, getMyEnrollments };
