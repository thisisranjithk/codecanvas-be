import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
} from './experience.schema.js';

const validateEmploymentType = async (employmentTypeId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: employmentTypeId },
  });

  if (!category) {
    throw new NotFoundError('Employment type not found');
  }

  if (category.type !== 'EMPLOYMENT_TYPE' || !category.isActive) {
    throw new BadRequestError('Invalid or inactive employment type');
  }
};

export const createExperience = async (userId: string, data: CreateExperienceInput) => {
  await validateEmploymentType(data.employmentTypeId);

  const experienceData: Prisma.ExperienceUncheckedCreateInput = {
    company: data.company,
    role: data.role,
    employmentTypeId: data.employmentTypeId,
    location: data.location ?? null,
    startDate: new Date(data.startDate),
    isCurrent: data.isCurrent,
    description: data.description ?? null,
    responsibilities: data.responsibilities,
    technologies: data.technologies,
    displayOrder: data.displayOrder,
    userId,
  };

  if (data.endDate) {
    experienceData.endDate = new Date(data.endDate);
  }

  const experience = await prisma.experience.create({
    data: experienceData,
  });

  return experience;
};

export const getExperiences = async (userId: string) => {
  const experiences = await prisma.experience.findMany({
    where: { userId },
    orderBy: [
      { displayOrder: 'asc' },
      { startDate: 'desc' },
    ],
    include: {
      employmentType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return experiences;
};

export const getExperienceById = async (userId: string, experienceId: string) => {
  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    include: {
      employmentType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!experience) {
    throw new NotFoundError('Experience not found');
  }

  if (experience.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return experience;
};

export const updateExperience = async (
  userId: string,
  experienceId: string,
  data: UpdateExperienceInput
) => {
  const experience = await getExperienceById(userId, experienceId);

  if (data.employmentTypeId) {
    await validateEmploymentType(data.employmentTypeId);
  }

  const updateData: Prisma.ExperienceUncheckedUpdateInput = {};

  if (data.company !== undefined) updateData.company = data.company;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.employmentTypeId !== undefined) updateData.employmentTypeId = data.employmentTypeId;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);

  if (data.isCurrent !== undefined) {
    updateData.isCurrent = data.isCurrent;
  }

  // Handling endDate specifically based on isCurrent rule.
  // The schema validation already ensures the combination is valid.
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }

  if (data.description !== undefined) updateData.description = data.description;
  if (data.responsibilities !== undefined) updateData.responsibilities = data.responsibilities;
  if (data.technologies !== undefined) updateData.technologies = data.technologies;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

  const updatedExperience = await prisma.experience.update({
    where: { id: experience.id },
    data: updateData,
  });

  return updatedExperience;
};

export const deleteExperience = async (userId: string, experienceId: string) => {
  const experience = await getExperienceById(userId, experienceId);

  await prisma.experience.delete({
    where: { id: experience.id },
  });

  return null;
};
