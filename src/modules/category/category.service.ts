import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import type { CreateCategoryInput, UpdateCategoryInput, GetCategoryDropdownQuery } from './category.schema.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/index.js';

export const create = async (data: CreateCategoryInput) => {
  const existingSlug = await prisma.category.findUnique({
    where: { slug: data.slug },
  });
  if (existingSlug) {
    throw new BadRequestError('Category with this slug already exists');
  }

  const existingNameType = await prisma.category.findFirst({
    where: { name: data.name, type: data.type },
  });
  if (existingNameType) {
    throw new BadRequestError(`Category with this name already exists for type ${data.type}`);
  }

  const createData: Prisma.CategoryUncheckedCreateInput = {
    name: data.name,
    slug: data.slug,
    type: data.type,
  };
  if (data.displayOrder !== undefined) createData.displayOrder = data.displayOrder;
  if (data.isActive !== undefined) createData.isActive = data.isActive;

  return prisma.category.create({
    data: createData,
  });
};

export const findAll = async () => {
  return prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};

export const findById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  return category;
};

export const update = async (id: string, data: UpdateCategoryInput) => {
  const category = await findById(id);

  if (data.name && data.name !== category.name) {
    const typeToCheck = data.type || category.type;
    const existingNameType = await prisma.category.findFirst({
      where: { name: data.name, type: typeToCheck, id: { not: id } },
    });
    if (existingNameType) {
      throw new BadRequestError(`Category with this name already exists for type ${typeToCheck}`);
    }
  }

  if (data.type && data.type !== category.type && !data.name) {
    const existingNameType = await prisma.category.findFirst({
      where: { name: category.name, type: data.type, id: { not: id } },
    });
    if (existingNameType) {
      throw new BadRequestError(`Category with this name already exists for type ${data.type}`);
    }
  }

  const updateData: Prisma.CategoryUncheckedUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.category.update({
    where: { id },
    data: updateData,
  });
};

export const deleteCategory = async (id: string) => {
  await findById(id);

  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new BadRequestError('Cannot delete category because it is in use.');
    }
    throw error;
  }
};

export const getDropdown = async (query: GetCategoryDropdownQuery) => {
  return prisma.category.findMany({
    where: {
      type: query.type,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { displayOrder: 'asc' },
  });
};
