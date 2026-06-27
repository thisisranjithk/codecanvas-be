import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import { QueryBuilder, PaginationQuery } from '../../shared/utils/query-builder.js';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsQueryInput,
} from './project.schema.js';

export const createProject = async (userId: string, data: CreateProjectInput) => {
  if (data.thumbnailMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.thumbnailMediaId },
    });

    if (!media) {
      throw new BadRequestError('Media not found for the given thumbnailMediaId');
    }
  }

  const projectData: Prisma.ProjectUncheckedCreateInput = {
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status,
    technologies: data.technologies,
    featured: data.featured,
    userId,
  };
  
  if (data.liveUrl !== undefined) projectData.liveUrl = data.liveUrl ?? null;
  if (data.githubUrl !== undefined) projectData.githubUrl = data.githubUrl ?? null;
  if (data.thumbnailMediaId !== undefined) projectData.thumbnailMediaId = data.thumbnailMediaId ?? null;

  const project = await prisma.project.create({
    data: projectData,
  });

  return project;
};

export const getProjects = async (userId: string, query: ListProjectsQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, category, status } = query;

  const filters: Prisma.ProjectWhereInput = { userId };

  if (category) filters.category = category;
  if (status) filters.status = status;

  const paginationQuery: PaginationQuery = {
    page: page || 1,
    limit: limit || 10,
    search,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const { where, orderBy, skip, take } = QueryBuilder.build(
    paginationQuery,
    ['title', 'description'],
    filters
  );

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        thumbnail: {
          select: {
            id: true,
            url: true,
            secureUrl: true,
            publicId: true,
          },
        },
      },
    }),
  ]);

  return {
    meta: QueryBuilder.paginate(total, paginationQuery.page, paginationQuery.limit),
    data: projects,
  };
};

export const getProjectById = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      thumbnail: {
        select: {
          id: true,
          url: true,
          secureUrl: true,
          publicId: true,
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  if (project.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return project;
};

export const updateProject = async (
  userId: string,
  projectId: string,
  data: UpdateProjectInput
) => {
  const project = await getProjectById(userId, projectId);

  if (data.thumbnailMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.thumbnailMediaId },
    });

    if (!media) {
      throw new BadRequestError('Media not found for the given thumbnailMediaId');
    }
  }

  const updateData: Prisma.ProjectUncheckedUpdateInput = {};
  
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.technologies !== undefined) updateData.technologies = data.technologies;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.liveUrl !== undefined) updateData.liveUrl = data.liveUrl ?? null;
  if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl ?? null;
  if (data.thumbnailMediaId !== undefined) updateData.thumbnailMediaId = data.thumbnailMediaId ?? null;

  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: updateData,
  });

  return updatedProject;
};

export const deleteProject = async (userId: string, projectId: string) => {
  const project = await getProjectById(userId, projectId);

  await prisma.project.delete({
    where: { id: project.id },
  });

  return null;
};
