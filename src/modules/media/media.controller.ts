import type { Request, Response } from 'express';
import * as mediaService from './media.service.js';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/index.js';
import { sendCreated, sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler } from '../../shared/utils/index.js';

export const uploadMediaHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  const folder = req.body.folder as string | undefined;
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const media = await mediaService.uploadMedia(req.file, folder, userId);

  sendCreated(res, 'Media uploaded successfully', { media });
});

export const getMediaHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const media = await mediaService.getMediaById(id as string);

  sendSuccess(res, 'Media retrieved successfully', { media });
});

export const deleteMediaHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await mediaService.deleteMedia(id as string);

  sendSuccess(res, 'Media deleted successfully', null);
});
