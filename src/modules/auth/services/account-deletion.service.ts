import { prisma } from '../../../config/database.js';
import cloudinary from '../../../config/cloudinary.js';

export async function deleteAccount(userId: string): Promise<void> {
  // 1. Fetch all user media to delete from Cloudinary
  const userMedia = await prisma.media.findMany({
    where: { uploadedById: userId },
    select: { publicId: true },
  });

  // 2. Delete media from Cloudinary concurrently
  if (userMedia.length > 0) {
    const publicIds = userMedia.map((m) => m.publicId);
    await Promise.all(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
        }),
      ),
    );
  }

  // 3. Execute all database operations within a single Prisma transaction.
  await prisma.$transaction(async (tx) => {
    await tx.user.delete({
      where: { id: userId },
    });
  });
}
