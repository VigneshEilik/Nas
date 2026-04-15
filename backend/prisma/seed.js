require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const creatorEmail = "creator@nasclone.dev";
  const studentEmail = "student@nasclone.dev";
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const creator = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {
      name: "Demo Creator",
      role: "CREATOR",
      passwordHash,
      bio: "I help creators launch impactful courses.",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    create: {
      name: "Demo Creator",
      email: creatorEmail,
      passwordHash,
      role: "CREATOR",
      bio: "I help creators launch impactful courses.",
      avatar: "https://i.pravatar.cc/150?img=11"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      name: "Demo Student",
      role: "STUDENT",
      passwordHash,
      bio: "Learning creator business systems.",
      avatar: "https://i.pravatar.cc/150?img=21"
    },
    create: {
      name: "Demo Student",
      email: studentEmail,
      passwordHash,
      role: "STUDENT",
      bio: "Learning creator business systems.",
      avatar: "https://i.pravatar.cc/150?img=21"
    }
  });

  const courseTitle = "Creator Economy Foundations";
  const course = await prisma.course.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {
      title: courseTitle,
      description: "Build audience, products, and sustainable creator income.",
      creatorId: creator.id
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      title: courseTitle,
      description: "Build audience, products, and sustainable creator income.",
      creatorId: creator.id
    }
  });

  await prisma.lesson.deleteMany({ where: { courseId: course.id } });
  await prisma.lesson.createMany({
    data: [
      {
        title: "Niche and Audience Positioning",
        content:
          "Define your niche, target persona, and value proposition. Build a clear creator identity.",
        order: 1,
        courseId: course.id
      },
      {
        title: "Content System Design",
        content:
          "Create a repeatable weekly content pipeline across short-form and long-form channels.",
        order: 2,
        courseId: course.id
      },
      {
        title: "Monetization Blueprint",
        content:
          "Map offers: memberships, cohorts, consulting, sponsorships, and optimize conversion pathways.",
        order: 3,
        courseId: course.id
      }
    ]
  });

  await prisma.enrollment.deleteMany({
    where: { cohort: { courseId: course.id } }
  });
  await prisma.cohort.deleteMany({ where: { courseId: course.id } });

  const cohort = await prisma.cohort.create({
    data: {
      courseId: course.id,
      startDate: new Date("2026-05-01T00:00:00.000Z"),
      endDate: new Date("2026-06-15T00:00:00.000Z")
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      cohortId: cohort.id
    }
  });

  await prisma.comment.deleteMany({
    where: {
      post: {
        OR: [{ authorId: creator.id }, { authorId: student.id }],
        courseId: course.id
      }
    }
  });
  await prisma.post.deleteMany({
    where: {
      OR: [{ authorId: creator.id }, { authorId: student.id }],
      courseId: course.id
    }
  });

  const creatorPost = await prisma.post.create({
    data: {
      content: "Welcome to the cohort! Share your current creator goal for this month.",
      authorId: creator.id,
      courseId: course.id
    }
  });

  await prisma.comment.create({
    data: {
      content: "My goal is to publish 12 shorts and launch my first paid workshop.",
      authorId: student.id,
      postId: creatorPost.id
    }
  });

  const studentPost = await prisma.post.create({
    data: {
      content: "What tools do you recommend for content planning and analytics?",
      authorId: student.id,
      courseId: course.id
    }
  });

  await prisma.comment.create({
    data: {
      content: "Start with Notion + native platform analytics, then layer in deeper tools later.",
      authorId: creator.id,
      postId: studentPost.id
    }
  });

  console.log("Seed completed.");
  console.log("Creator login:", creatorEmail, "Password@123");
  console.log("Student login:", studentEmail, "Password@123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
