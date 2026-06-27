import type { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../config/cloudinary.js';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class MediaService {
  /**
   * Uploads a file buffer to Cloudinary and saves metadata in the database.
   * @param file Express.Multer.File object
   * @param folder Optional folder name in Cloudinary
   * @param userId ID of the user uploading the file
   * @returns Created Media record
   */
  async uploadMedia(file: Express.Multer.File, folder: string | undefined, userId: string) {
    // 1. Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder ? `portfolio-cms/${folder}` : 'portfolio-cms/general',
          resource_type: 'auto',
        },
        (error: any, result: UploadApiResponse | undefined) => {
          if (error) return reject(new Error(error.message || 'Cloudinary upload error'));
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
  }

  /**
   * Retrieves media metadata by ID.
   * @param id Media ID
   * @returns Media record
   */
  async getMediaById(id: string) {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundError('Media not found');
    }

    return media;
  }

  /**
   * Deletes media from Cloudinary and database.
   * @param id Media ID
   */
  async deleteMedia(id: string) {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundError('Media not found');
    }

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    // 2. Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return true;
  }
}

export const mediaService = new MediaService();
