import type { Request, Response } from 'express';
import { mediaService } from './media.service.js';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/index.js';
import { sendCreated, sendSuccess } from '../../shared/responses/index.js';

export class MediaController {
  uploadMedia = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const { folder } = req.body;
    // req.user is populated by the auth middleware
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    const media = await mediaService.uploadMedia(req.file, folder, userId);

    sendCreated(res, 'Media uploaded successfully', { media });
  };

  getMedia = async (req: Request, res: Response) => {
    const { id } = req.params;
    const media = await mediaService.getMediaById(id as string);

    sendSuccess(res, 'Media retrieved successfully', { media });
  };

  deleteMedia = async (req: Request, res: Response) => {
    const { id } = req.params;
    await mediaService.deleteMedia(id as string);

    sendSuccess(res, 'Media deleted successfully', null);
  };
}

export const mediaController = new MediaController();
