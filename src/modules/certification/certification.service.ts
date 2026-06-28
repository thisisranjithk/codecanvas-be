import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type { CreateCertificationInput, UpdateCertificationInput } from './certification.schema.js';

export const createCertification = async (userId: string, data: CreateCertificationInput) => {
  if (data.certificateMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.certificateMediaId },
    });

    if (!media) {
      throw new BadRequestError('Media not found for the given certificateMediaId');
    }
  }

  const certificationData: Prisma.CertificationUncheckedCreateInput = {
    name: data.name,
    issuer: data.issuer,
    issueDate: new Date(data.issueDate),
    userId,
  };

  if (data.expiryDate !== undefined) certificationData.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  if (data.credentialId !== undefined) certificationData.credentialId = data.credentialId || null;
  if (data.verificationUrl !== undefined) certificationData.verificationUrl = data.verificationUrl || null;
  if (data.certificateMediaId !== undefined) certificationData.certificateMediaId = data.certificateMediaId || null;
  if (data.displayOrder !== undefined) certificationData.displayOrder = data.displayOrder;

  const certification = await prisma.certification.create({
    data: certificationData,
  });

  return certification;
};

export const getCertifications = async (userId: string) => {
  const certifications = await prisma.certification.findMany({
    where: { userId },
    orderBy: [
      { displayOrder: 'asc' },
      { issueDate: 'desc' },
    ],
    include: {
      certificateMedia: {
        select: {
          id: true,
          url: true,
          secureUrl: true,
          publicId: true,
        },
      },
    },
  });

  return certifications;
};

export const getCertificationById = async (userId: string, certificationId: string) => {
  const certification = await prisma.certification.findUnique({
    where: { id: certificationId },
    include: {
      certificateMedia: {
        select: {
          id: true,
          url: true,
          secureUrl: true,
          publicId: true,
        },
      },
    },
  });

  if (!certification) {
    throw new NotFoundError('Certification not found');
  }

  if (certification.userId !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return certification;
};

export const updateCertification = async (
  userId: string,
  certificationId: string,
  data: UpdateCertificationInput
) => {
  const certification = await getCertificationById(userId, certificationId);

  if (data.certificateMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: data.certificateMediaId },
    });

    if (!media) {
      throw new BadRequestError('Media not found for the given certificateMediaId');
    }
  }

  const updateData: Prisma.CertificationUncheckedUpdateInput = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.issuer !== undefined) updateData.issuer = data.issuer;
  if (data.issueDate !== undefined) updateData.issueDate = new Date(data.issueDate);
  if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  if (data.credentialId !== undefined) updateData.credentialId = data.credentialId || null;
  if (data.verificationUrl !== undefined) updateData.verificationUrl = data.verificationUrl || null;
  if (data.certificateMediaId !== undefined) updateData.certificateMediaId = data.certificateMediaId || null;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

  const updatedCertification = await prisma.certification.update({
    where: { id: certification.id },
    data: updateData,
  });

  return updatedCertification;
};

export const deleteCertification = async (userId: string, certificationId: string) => {
  const certification = await getCertificationById(userId, certificationId);

  await prisma.certification.delete({
    where: { id: certification.id },
  });

  return null;
};
