import type { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../config/cloudinary.js';
import { prisma } from '../../config/database.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type { UserRole } from '@prisma/client';

export const uploadMedia = async (file: Express.Multer.File, folder: string | undefined, userId: string) => {
  // 1. Upload to Cloudinary using upload_stream
  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder ? `portfolio-cms/${folder}` : 'portfolio-cms/general',
        resource_type: 'auto',
      },
      (error: unknown, result: UploadApiResponse | undefined) => {
        if (error) {
          const errorMessage = error instanceof Error ? error.message : 'Cloudinary upload error';
          return reject(new Error(errorMessage));
        }
        if (result) return resolve(result);
        reject(new Error('Unknown upload error'));
      }
    );

    uploadStream.end(file.buffer);
  });

  // 2. Save metadata to Prisma
  const media = await prisma.media.create({
    data: {
      originalName: file.originalname,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format || 'unknown',
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      folder: folder || null,
      uploadedById: userId,
    },
  });

  return media;
};

export const getMediaById = async (id: string, userId: string, userRole: UserRole) => {
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new NotFoundError('Media not found');
  }

  if (userRole !== 'ADMIN' && media.uploadedById !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return media;
};

export const deleteMedia = async (id: string, userId: string, userRole: UserRole) => {
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new NotFoundError('Media not found');
  }

  if (userRole !== 'ADMIN' && media.uploadedById !== userId) {
    throw new ForbiddenError('Access denied');
  }

  await cloudinary.uploader.destroy(media.publicId);

  await prisma.media.delete({
    where: { id },
  });

  return true;
};
