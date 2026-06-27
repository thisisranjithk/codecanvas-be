import { z } from 'zod';

export const MediaFolderEnum = z.enum([
  'avatars',
  'projects',
  'blogs',
  'certificates',
  'resume',
]);

export const UploadMediaSchema = z.object({
  folder: MediaFolderEnum.optional(),
});
