import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type {
  CreateEducationInput,
  UpdateEducationInput,
} from './education.schema.js';

export const createEducation = async (userId: string, data: CreateEducationInput) => {
  const educationData: Prisma.EducationUncheckedCreateInput = {
    institution: data.institution,
    degree: data.degree,
    fieldOfStudy: data.fieldOfStudy,
    startDate: new Date(data.startDate),
    gpa: data.gpa ?? null,
    location: data.location ?? null,
    description: data.description ?? null,
    activities: data.activities,
    displayOrder: data.displayOrder,
    userId,
  };

  if (data.endDate) {
    educationData.endDate = new Date(data.endDate);
  }

  const education = await prisma.education.create({
    data: educationData,
  });

  return education;
};

export const getEducations = async (userId: string) => {
  const educations = await prisma.education.findMany({
    where: { userId },
    orderBy: [
      { displayOrder: 'asc' },
      { startDate: 'desc' },
    ],
  });

  return educations;
};

export const getEducationById = async (userId: string, educationId: string) => {
  const education = await prisma.education.findUnique({
    where: { id: educationId },
  });

  if (!education) {
    throw new NotFoundError('Education not found');
  }

  if (education.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return education;
};

export const updateEducation = async (
  userId: string,
  educationId: string,
  data: UpdateEducationInput
) => {
  const education = await getEducationById(userId, educationId);

  const updateData: Prisma.EducationUncheckedUpdateInput = {};

  if (data.institution !== undefined) updateData.institution = data.institution;
  if (data.degree !== undefined) updateData.degree = data.degree;
  if (data.fieldOfStudy !== undefined) updateData.fieldOfStudy = data.fieldOfStudy;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);

  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }

  if (data.gpa !== undefined) updateData.gpa = data.gpa;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.activities !== undefined) updateData.activities = data.activities;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

  const updatedEducation = await prisma.education.update({
    where: { id: education.id },
    data: updateData,
  });

  return updatedEducation;
};

export const deleteEducation = async (userId: string, educationId: string) => {
  const education = await getEducationById(userId, educationId);

  await prisma.education.delete({
    where: { id: education.id },
  });

  return null;
};
