const prisma = require("../lib/prisma");

const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, bio: true, avatar: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, bio, avatar },
      select: { id: true, name: true, email: true, role: true, bio: true, avatar: true, createdAt: true }
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getMyProfile, updateMyProfile };
