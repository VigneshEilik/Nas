const prisma = require("../lib/prisma");

const handlePrismaError = (res, error, fallbackMessage) => {
  console.error("[course.controller]", error);
  const combinedMessage = `${error?.message || ""} ${error?.cause || ""}`.toLowerCase();

  if (error?.code === "P1001" || combinedMessage.includes("can't reach database server")) {
    return res.status(503).json({ message: "Database is unreachable. Ensure PostgreSQL is running." });
  }
  if (error?.code === "P2021" || combinedMessage.includes("table") || combinedMessage.includes("does not exist")) {
    return res.status(503).json({ message: "Database is not initialized. Run `npx prisma migrate dev --name init`." });
  }

  return res.status(500).json({ message: fallbackMessage });
};

const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      status: "APPROVED",
      creator: { isBanned: false }
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { lessons: true } }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.course.count({ where })
    ]);

    return res.status(200).json({
      courses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    return handlePrismaError(res, error, "Failed to fetch courses");
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findFirst({
      where: { 
        id: req.params.id,
        status: "APPROVED",
        creator: { isBanned: false }
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        lessons: { orderBy: { order: "asc" } },
        cohorts: { orderBy: { startDate: "asc" } }
      }
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json(course);
  } catch (error) {
    return handlePrismaError(res, error, "Failed to fetch course");
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Title and description are required" });
    const course = await prisma.course.create({
      data: { title, description, creatorId: req.user.id }
    });
    return res.status(201).json(course);
  } catch (error) {
    return handlePrismaError(res, error, "Failed to create course");
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.creatorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { title: req.body.title, description: req.body.description }
    });
    return res.status(200).json(updated);
  } catch (error) {
    return handlePrismaError(res, error, "Failed to update course");
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.creatorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
    await prisma.course.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    return handlePrismaError(res, error, "Failed to delete course");
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
