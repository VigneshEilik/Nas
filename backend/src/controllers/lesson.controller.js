const prisma = require("../lib/prisma");

const canEditCourse = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { ok: false, status: 404, message: "Course not found" };
  if (course.creatorId !== userId) return { ok: false, status: 403, message: "Forbidden" };
  return { ok: true };
};

const createLesson = async (req, res) => {
  try {
    const { title, content, order, courseId } = req.body;
    if (!title || !content || order === undefined || !courseId) {
      return res.status(400).json({ message: "title, content, order and courseId are required" });
    }
    const permission = await canEditCourse(req.user.id, courseId);
    if (!permission.ok) return res.status(permission.status).json({ message: permission.message });
    const lesson = await prisma.lesson.create({ data: { title, content, order, courseId } });
    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create lesson" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    const permission = await canEditCourse(req.user.id, lesson.courseId);
    if (!permission.ok) return res.status(permission.status).json({ message: permission.message });
    const updated = await prisma.lesson.update({
      where: { id: req.params.id },
      data: { title: req.body.title, content: req.body.content, order: req.body.order }
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update lesson" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    const permission = await canEditCourse(req.user.id, lesson.courseId);
    if (!permission.ok) return res.status(permission.status).json({ message: permission.message });
    await prisma.lesson.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Lesson deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete lesson" });
  }
};

module.exports = { createLesson, updateLesson, deleteLesson };
