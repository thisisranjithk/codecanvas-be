import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/responses/index.js';
import * as experienceService from './experience.service.js';
import type { CreateExperienceInput, UpdateExperienceInput } from './experience.schema.js';

export const createExperienceHandler = async (
  req: Request<object, object, CreateExperienceInput>,
  res: Response
) => {
  const userId = req.user!.id;
  const experience = await experienceService.createExperience(userId, req.body);
  sendSuccess(res, 'Experience created successfully', experience, 201);
};

export const getExperiencesHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const experiences = await experienceService.getExperiences(userId);
  sendSuccess(res, 'Experiences retrieved successfully', experiences);
};

export const getExperienceHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = req.user!.id;
  const experience = await experienceService.getExperienceById(userId, req.params.id);
  sendSuccess(res, 'Experience retrieved successfully', experience);
};

export const updateExperienceHandler = async (
  req: Request<{ id: string }, object, UpdateExperienceInput>,
  res: Response
) => {
  const userId = req.user!.id;
  const experience = await experienceService.updateExperience(
    userId,
    req.params.id,
    req.body
  );
  sendSuccess(res, 'Experience updated successfully', experience);
};

export const deleteExperienceHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = req.user!.id;
  await experienceService.deleteExperience(userId, req.params.id);
  sendSuccess(res, 'Experience deleted successfully', null, 204);
};
