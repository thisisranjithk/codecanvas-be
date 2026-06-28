import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../shared/errors/index.js';
import type { PaginationQuery } from '../../shared/utils/query-builder.js';
import { QueryBuilder } from '../../shared/utils/query-builder.js';
import type {
  CreateBlogInput,
  UpdateBlogInput,
  ListBlogsQueryInput,
} from './blog.schema.js';

export const createBlog = async (userId: string, data: CreateBlogInput) => {
  if (data.coverMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.coverMediaId },
    });
    if (!media) {
      throw new BadRequestError('Media not found for the given coverMediaId');
    }
  }

  const existingSlug = await prisma.blog.findUnique({
    where: { slug: data.slug },
  });
  if (existingSlug) {
    throw new ConflictError('Slug is already in use');
  }

  const blogData: Prisma.BlogUncheckedCreateInput = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags,
    userId,
  };

  if (data.coverMediaId !== undefined) blogData.coverMediaId = data.coverMediaId;
  if (data.readTime !== undefined) blogData.readTime = data.readTime;
  if (data.status !== undefined) blogData.status = data.status;
  if (data.featured !== undefined) blogData.featured = data.featured;
  if (data.seoTitle !== undefined) blogData.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) blogData.seoDescription = data.seoDescription;

  if (data.status === 'PUBLISHED') {
    blogData.publishedAt = new Date();
  }

  return prisma.blog.create({
    data: blogData,
  });
};

export const getBlogs = async (userId: string, query: ListBlogsQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, status, featured } = query;

  const filters: Prisma.BlogWhereInput = { userId };

  if (status) filters.status = status;
  if (featured !== undefined) filters.featured = featured;

  const paginationQuery: PaginationQuery = {
    page: page || 1,
    limit: limit || 10,
    search,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const queryResult = QueryBuilder.build(
    paginationQuery,
    ['title', 'excerpt'],
    filters
  );

  const where = queryResult.where;
  const orderBy = queryResult.orderBy;
  const skip = queryResult.skip as number;
  const take = queryResult.take as number;

  // Extend search to tags if search is provided
  if (search) {
    if (!where.OR) {
      where.OR = [];
    }
    where.OR.push({
      tags: { has: search },
    });
  }

  const [total, blogs] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        coverMedia: {
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
    data: blogs,
  };
};

export const getBlogById = async (userId: string, blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      coverMedia: {
        select: {
          id: true,
          url: true,
          secureUrl: true,
          publicId: true,
        },
      },
    },
  });

  if (!blog) {
    throw new NotFoundError('Blog not found');
  }

  if (blog.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return blog;
};

export const updateBlog = async (
  userId: string,
  blogId: string,
  data: UpdateBlogInput
) => {
  const blog = await getBlogById(userId, blogId);

  if (data.coverMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.coverMediaId },
    });
    if (!media) {
      throw new BadRequestError('Media not found for the given coverMediaId');
    }
  }

  if (data.slug && data.slug !== blog.slug) {
    const existingSlug = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      throw new ConflictError('Slug is already in use');
    }
  }

  const updateData: Prisma.BlogUncheckedUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.coverMediaId !== undefined) updateData.coverMediaId = data.coverMediaId;
  if (data.readTime !== undefined) updateData.readTime = data.readTime;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;

  if (data.status === 'PUBLISHED' && blog.status !== 'PUBLISHED') {
    updateData.publishedAt = new Date();
  }

  return prisma.blog.update({
    where: { id: blog.id },
    data: updateData,
  });
};

export const deleteBlog = async (userId: string, blogId: string) => {
  const blog = await getBlogById(userId, blogId);

  await prisma.blog.delete({
    where: { id: blog.id },
  });

  return null;
};
