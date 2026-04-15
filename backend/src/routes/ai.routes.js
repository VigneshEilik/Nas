const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { generateSummary, generateQuiz } = require("../services/ai.service");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/lessons/:id/summary", verifyToken, async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    
    const summary = await generateSummary(lesson.content);
    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/lessons/:id/quiz", verifyToken, async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const quiz = await generateQuiz(lesson.title, lesson.content);
    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
