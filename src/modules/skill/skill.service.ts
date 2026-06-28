import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type { CreateSkillInput, UpdateSkillInput } from './skill.schema.js';

export async function createSkill(userId: string, data: CreateSkillInput) {
  return prisma.skill.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function getSkills(userId: string) {
  return prisma.skill.findMany({
    where: { userId },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getSkillById(userId: string, id: string) {
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) {
    throw new NotFoundError('Skill not found');
  }

  if (skill.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return skill;
}

export async function updateSkill(userId: string, id: string, data: UpdateSkillInput) {
  const skill = await getSkillById(userId, id);

  const updateData: Prisma.SkillUncheckedUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.proficiency !== undefined) updateData.proficiency = data.proficiency;
  if (data.yearsOfExperience !== undefined) updateData.yearsOfExperience = data.yearsOfExperience;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

  return prisma.skill.update({
    where: { id: skill.id },
    data: updateData,
  });
}

export async function deleteSkill(userId: string, id: string) {
  const skill = await getSkillById(userId, id);

  return prisma.skill.delete({
    where: { id: skill.id },
  });
}
