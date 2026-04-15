require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const cohortRoutes = require("./routes/cohort.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const communityRoutes = require("./routes/community.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");
const progressRoutes = require("./routes/progress.routes");
const likeRoutes = require("./routes/like.routes");
const uploadRoutes = require("./routes/upload.routes");
const aiRoutes = require("./routes/ai.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/cohorts", cohortRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", progressRoutes);
app.use("/api", likeRoutes);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: err.message || "Internal Server Error" });
});

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("join-course", (courseId) => {
    socket.join(courseId);
    console.log(`Socket ${socket.id} joined course ${courseId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Attach io to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});
