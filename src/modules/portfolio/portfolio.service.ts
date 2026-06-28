import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/index.js';
import type { ListProjectsQueryInput } from '../project/project.schema.js';
import type { ListBlogsQueryInput } from '../blog/blog.schema.js';
import type { PaginationQuery } from '../../shared/utils/query-builder.js';
import { QueryBuilder } from '../../shared/utils/query-builder.js';

// ─── Username Resolution ──────────────────────────────────────────────────────

const resolveUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, fullName: true, username: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new NotFoundError('Portfolio not found.');
  }

  return user;
};

// ─── View Model Transformers ──────────────────────────────────────────────────

type ProfileRecord = {
  headline: string | null;
  bio: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  avatarUrl: string | null;
};

const toProfileView = (
  user: { fullName: string; username: string },
  profile: ProfileRecord | null,
) => ({
  fullName: user.fullName,
  username: user.username,
  headline: profile?.headline ?? null,
  bio: profile?.bio ?? null,
  location: profile?.location ?? null,
  github: profile?.github ?? null,
  linkedin: profile?.linkedin ?? null,
  twitter: profile?.twitter ?? null,
  website: profile?.website ?? null,
  avatarUrl: profile?.avatarUrl ?? null,
});

const toProjectView = (project: Record<string, unknown>) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  status: project.status,
  technologies: project.technologies,
  liveUrl: project.liveUrl,
  githubUrl: project.githubUrl,
  featured: project.featured,
  categoryName: (project.category as { name: string } | null)?.name ?? null,
  thumbnailUrl:
    (project.thumbnail as { secureUrl: string } | null)?.secureUrl ?? null,
  createdAt: project.createdAt,
});

const toBlogView = (blog: Record<string, unknown>) => ({
  id: blog.id,
  title: blog.title,
  slug: blog.slug,
  excerpt: blog.excerpt,
  content: blog.content,
  readTime: blog.readTime,
  tags: blog.tags,
  status: blog.status,
  featured: blog.featured,
  publishedAt: blog.publishedAt,
  seoTitle: blog.seoTitle,
  seoDescription: blog.seoDescription,
  coverImageUrl:
    (blog.coverMedia as { secureUrl: string } | null)?.secureUrl ?? null,
});

const toSkillView = (skill: Record<string, unknown>) => ({
  name: skill.name,
  proficiency: skill.proficiency,
  yearsOfExperience: skill.yearsOfExperience,
  displayOrder: skill.displayOrder,
  categoryName: (skill.category as { name: string } | null)?.name ?? null,
});

const toExperienceView = (exp: Record<string, unknown>) => ({
  company: exp.company,
  role: exp.role,
  employmentTypeName:
    (exp.employmentType as { name: string } | null)?.name ?? null,
  location: exp.location,
  startDate: exp.startDate,
  endDate: exp.endDate,
  isCurrent: exp.isCurrent,
  description: exp.description,
  responsibilities: exp.responsibilities,
  technologies: exp.technologies,
  displayOrder: exp.displayOrder,
});

const toEducationView = (edu: Record<string, unknown>) => ({
  institution: edu.institution,
  degree: edu.degree,
  fieldOfStudy: edu.fieldOfStudy,
  startDate: edu.startDate,
  endDate: edu.endDate,
  gpa: edu.gpa,
  location: edu.location,
  description: edu.description,
  activities: edu.activities,
  displayOrder: edu.displayOrder,
});

const toCertificationView = (cert: Record<string, unknown>) => ({
  name: cert.name,
  issuer: cert.issuer,
  issueDate: cert.issueDate,
  expiryDate: cert.expiryDate,
  credentialId: cert.credentialId,
  verificationUrl: cert.verificationUrl,
  certificateUrl:
    (cert.certificateMedia as { secureUrl: string } | null)?.secureUrl ?? null,
  displayOrder: cert.displayOrder,
});

// ─── Portfolio Service ────────────────────────────────────────────────────────

export const getPortfolioHomepage = async (username: string) => {
  const user = await resolveUserByUsername(username);
  const userId = user.id;

  const [
    profile,
    skills,
    experiences,
    educations,
    featuredProjects,
    featuredCertifications,
    latestBlogs,
  ] = await Promise.all([
    prisma.profile
      .findUnique({ where: { userId } })
      .then(async (p) => {
        if (!p) return null;
        let avatarUrl: string | null = null;
        if (p.avatar) {
          const media = await prisma.media.findUnique({
            where: { id: p.avatar },
          });
          if (media) avatarUrl = media.secureUrl;
        }
        return { ...p, avatarUrl };
      }),
    prisma.skill.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.experience.findMany({
      where: { userId },
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
      include: { employmentType: { select: { id: true, name: true } } },
    }),
    prisma.education.findMany({
      where: { userId },
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    }),
    prisma.project.findMany({
      where: { userId, status: 'PUBLISHED', featured: true },
      include: {
        thumbnail: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.certification.findMany({
      where: { userId },
      orderBy: [{ displayOrder: 'asc' }, { issueDate: 'desc' }],
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
    profile: toProfileView(user, profile),
    projects: featuredProjects.map((p) => toProjectView(p as Record<string, unknown>)),
    skills: skills.map((s) => toSkillView(s as Record<string, unknown>)),
    experience: experiences.map((e) => toExperienceView(e as Record<string, unknown>)),
    education: educations.map((e) => toEducationView(e as Record<string, unknown>)),
    certifications: featuredCertifications.map((c) =>
      toCertificationView(c as Record<string, unknown>),
    ),
    blogs: latestBlogs.map((b) => toBlogView(b as Record<string, unknown>)),
  };
};

export const getPortfolioProjects = async (
  username: string,
  query: ListProjectsQueryInput,
) => {
  const user = await resolveUserByUsername(username);
  const userId = user.id;

  const { page, limit, search, sortBy, sortOrder, categoryId } = query;

  const filters: Record<string, unknown> = {
    userId,
    status: 'PUBLISHED',
  };

  if (categoryId) filters.categoryId = categoryId;

  const paginationQuery: PaginationQuery = {
    page: page || 1,
    limit: limit || 10,
    search,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { where, orderBy, skip, take } = QueryBuilder.build(
    paginationQuery,
    ['title', 'description'],
    filters,
  );

  const [total, projects] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prisma.project.count({ where }),
    prisma.project.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      orderBy,
      skip,
      take,
      include: {
        thumbnail: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
        category: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    meta: QueryBuilder.paginate(total, paginationQuery.page, paginationQuery.limit),
    data: projects.map((p) => toProjectView(p as Record<string, unknown>)),
  };
};

export const getPortfolioProjectById = async (
  username: string,
  id: string,
) => {
  const user = await resolveUserByUsername(username);

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      thumbnail: {
        select: { id: true, url: true, secureUrl: true, publicId: true },
      },
      category: { select: { id: true, name: true } },
    },
  });

  if (!project || project.userId !== user.id || project.status !== 'PUBLISHED') {
    throw new NotFoundError('Project not found.');
  }

  return toProjectView(project);
};

export const getPortfolioBlogs = async (
  username: string,
  query: ListBlogsQueryInput,
) => {
  const user = await resolveUserByUsername(username);
  const userId = user.id;

  const { page, limit, search, sortBy, sortOrder, featured } = query;

  const filters: Record<string, unknown> = {
    userId,
    status: 'PUBLISHED',
  };

  if (featured !== undefined) filters.featured = featured;

  const paginationQuery: PaginationQuery = {
    page: page || 1,
    limit: limit || 10,
    search,
    sortBy: sortBy || 'publishedAt',
    sortOrder: sortOrder || 'desc',
  };

  const queryResult = QueryBuilder.build(
    paginationQuery,
    ['title', 'excerpt'],
    filters,
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const where = queryResult.where;
  const orderBy = queryResult.orderBy;
  const skip = queryResult.skip;
  const take = queryResult.take;

  if (search) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!where.OR) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.OR = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    where.OR.push({ tags: { has: search } });
  }

  const [total, blogs] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      orderBy,
      skip,
      take,
      include: {
        coverMedia: {
          select: { id: true, url: true, secureUrl: true, publicId: true },
        },
      },
    }),
  ]);

  return {
    meta: QueryBuilder.paginate(total, paginationQuery.page, paginationQuery.limit),
    data: blogs.map((b) => toBlogView(b as Record<string, unknown>)),
  };
};

export const getPortfolioBlogBySlug = async (
  username: string,
  slug: string,
) => {
  const user = await resolveUserByUsername(username);

  const blog = await prisma.blog.findFirst({
    where: {
      userId: user.id,
      slug,
      status: 'PUBLISHED',
    },
    include: {
      coverMedia: {
        select: { id: true, url: true, secureUrl: true, publicId: true },
      },
    },
  });

  if (!blog) {
    throw new NotFoundError('Blog not found.');
  }

  return toBlogView(blog);
};
