const prisma = require("../lib/prisma");

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_postId: { userId, postId } }
      });
      return res.status(200).json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId, postId }
      });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    console.error("[like.controller]", error);
    return res.status(500).json({ message: "Failed to toggle like" });
  }
};

module.exports = { toggleLike };
