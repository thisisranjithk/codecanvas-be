import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/index.js';
import * as profileService from '../profile/profile.service.js';
import * as skillService from '../skill/skill.service.js';
import * as experienceService from '../experience/experience.service.js';
import * as educationService from '../education/education.service.js';
import * as projectService from '../project/project.service.js';
import * as blogService from '../blog/blog.service.js';
import type { ListProjectsQueryInput } from '../project/project.schema.js';
import type { ListBlogsQueryInput } from '../blog/blog.schema.js';

export const getAdminUserId = async () => {
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN', isActive: true },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!adminUser) {
    throw new NotFoundError('Portfolio owner not found');
  }

  return adminUser.id;
};

export const getPortfolioHomepage = async () => {
  const userId = await getAdminUserId();

  const [
    profile,
    skills,
    experiences,
    educations,
    featuredProjects,
    featuredCertifications,
    latestBlogs,
  ] = await Promise.all([
    profileService.getProfileByUserId(userId).catch(() => null),
    skillService.getSkills(userId),
    experienceService.getExperiences(userId),
    educationService.getEducations(userId),
    prisma.project.findMany({
      where: { userId, status: 'PUBLISHED', featured: true },
      include: {
        thumbnail: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.certification.findMany({
      where: { userId },
      orderBy: [
        { displayOrder: 'asc' },
        { issueDate: 'desc' },
      ],
      include: {
        certificateMedia: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
      },
      take: 3,
    }),
    prisma.blog.findMany({
      where: { userId, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        coverMedia: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
      },
      take: 3,
    }),
  ]);

  return {
    profile,
    projects: featuredProjects,
    skills,
    experience: experiences,
    education: educations,
    certifications: featuredCertifications,
    blogs: latestBlogs,
  };
};

export const getPortfolioProjects = async (query: ListProjectsQueryInput) => {
  const userId = await getAdminUserId();

  // Force status to be PUBLISHED
  const safeQuery: ListProjectsQueryInput = {
    ...query,
    status: 'PUBLISHED',
  };

  return projectService.getProjects(userId, safeQuery);
};

export const getPortfolioProjectById = async (id: string) => {
  const userId = await getAdminUserId();
  const project = await projectService.getProjectById(userId, id);

  if (project.status !== 'PUBLISHED') {
    throw new NotFoundError('Project not found');
  }

  return project;
};

export const getPortfolioBlogs = async (query: ListBlogsQueryInput) => {
  const userId = await getAdminUserId();

  // Force status to be PUBLISHED
  const safeQuery: ListBlogsQueryInput = {
    ...query,
    status: 'PUBLISHED',
  };

  return blogService.getBlogs(userId, safeQuery);
};

export const getPortfolioBlogBySlug = async (slug: string) => {
  const userId = await getAdminUserId();

  const blog = await prisma.blog.findFirst({
    where: {
      userId,
      slug,
      status: 'PUBLISHED'
    },
    include: {
      coverMedia: {
        select: { id: true, url: true, secureUrl: true, publicId: true },
      },
    },
  });

  if (!blog) {
    throw new NotFoundError('Blog not found');
  }

  return blog;
};
