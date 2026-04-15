const prisma = require("../lib/prisma");

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = courseId ? { courseId } : {};
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        include: {
          author: { select: { id: true, name: true, role: true, avatar: true } },
          course: { select: { id: true, title: true } },
          likes: { where: { userId: req.user.id } }, // minimized check
          _count: { select: { likes: true, comments: true } },
          comments: {
            take: 3, // only load first 3 comments in list
            include: {
              author: { select: { id: true, name: true, avatar: true } }
            },
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.post.count({ where })
    ]);

    const data = posts.map(post => ({
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      isLiked: post.likes.length > 0,
      likes: undefined
    }));

    return res.status(200).json({
      posts: data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error("[community.controller]", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

const createPost = async (req, res) => {
  try {
    const { content, courseId } = req.body;
    if (!content) return res.status(400).json({ message: "content is required" });
    
    const post = await prisma.post.create({
      data: { content, authorId: req.user.id, courseId: courseId || null },
      include: {
        author: { select: { id: true, name: true, role: true, avatar: true } },
        course: { select: { id: true, title: true } }
      }
    });

    const data = {
      ...post,
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      comments: []
    };

    if (req.io) {
      const room = courseId || "global";
      req.io.to(room).emit("new-post", data);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("[community.controller]", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

const createComment = async (req, res) => {
  try {
    if (!req.body.content) return res.status(400).json({ message: "content is required" });
    const postId = req.params.id;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const comment = await prisma.comment.create({
      data: { content: req.body.content, postId, authorId: req.user.id },
      include: {
        author: { select: { id: true, name: true, avatar: true } }
      }
    });

    if (req.io) {
      const room = post.courseId || "global";
      req.io.to(room).emit("new-comment", { postId, comment });
    }

    return res.status(201).json(comment);
  } catch (error) {
    console.error("[community.controller]", error);
    return res.status(500).json({ message: "Failed to create comment" });
  }
};
const getComments = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "asc" }
    });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.status(200).json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId, postId } });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to toggle like" });
  }
};

module.exports = { getPosts, createPost, getComments, createComment, toggleLike };
