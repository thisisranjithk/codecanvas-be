import { prisma } from '../../config/database.js';

export const getDashboardData = async (userId: string) => {
  // 1. Overview Statistics
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalSkills,
    totalExperience,
    totalEducation,
    totalCertifications,
  ] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: 'PUBLISHED' } }),
    prisma.project.count({ where: { userId, status: 'DRAFT' } }),
    prisma.blog.count({ where: { userId } }),
    prisma.blog.count({ where: { userId, status: 'PUBLISHED' } }),
    prisma.blog.count({ where: { userId, status: 'DRAFT' } }),
    prisma.skill.count({ where: { userId } }),
    prisma.experience.count({ where: { userId } }),
    prisma.education.count({ where: { userId } }),
    prisma.certification.count({ where: { userId } }),
  ]);

  const stats = {
    projects: totalProjects,
    publishedProjects,
    draftProjects,
    blogs: totalBlogs,
    publishedBlogs,
    draftBlogs,
    skills: totalSkills,
    experience: totalExperience,
    education: totalEducation,
    certifications: totalCertifications,
  };

  // 2. Featured Content
  const [featuredProject, latestBlog, latestCertification] = await Promise.all([
    prisma.project.findFirst({
      where: { userId, featured: true },
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    }),
    prisma.blog.findFirst({
      where: { userId, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.certification.findFirst({
      where: { userId },
      orderBy: { issueDate: 'desc' },
    }),
  ]);

  const featuredContent = {
    featuredProject: featuredProject || null,
    latestBlog: latestBlog || null,
    latestCertification: latestCertification || null,
  };

  // 3. Recent Activity
  const [
    recentProjects,
    recentBlogs,
    recentCertifications,
    recentExperiences,
    recentEducations,
  ] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.certification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.experience.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.education.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  // Map into common activity format
  const activities = [
    ...recentProjects.map((p) => ({
      type: 'PROJECT_CREATED',
      title: p.title,
      timestamp: p.createdAt.toISOString(),
    })),
    ...recentBlogs.map((b) => ({
      type: 'BLOG_CREATED',
      title: b.title,
      timestamp: b.createdAt.toISOString(),
    })),
    ...recentCertifications.map((c) => ({
      type: 'CERTIFICATION_ADDED',
      title: c.name,
      timestamp: c.createdAt.toISOString(),
    })),
    ...recentExperiences.map((e) => ({
      type: 'EXPERIENCE_ADDED',
      title: `${e.role} at ${e.company}`,
      timestamp: e.createdAt.toISOString(),
    })),
    ...recentEducations.map((e) => ({
      type: 'EDUCATION_ADDED',
      title: `${e.degree} at ${e.institution}`,
      timestamp: e.createdAt.toISOString(),
    })),
  ];

  // Sort descending by timestamp and take top 10
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivity = activities.slice(0, 10);

  return {
    stats,
    recentActivity,
    featuredContent,
  };
};
