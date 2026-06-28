import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/responses/index.js';
import * as educationService from './education.service.js';
import type { CreateEducationInput, UpdateEducationInput } from './education.schema.js';

export const createEducationHandler = async (
  req: Request<object, object, CreateEducationInput>,
  res: Response
) => {
  const userId = req.user!.id;
  const education = await educationService.createEducation(userId, req.body);
  sendSuccess(res, 'Education created successfully', education, 201);
};

export const getEducationsHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const educations = await educationService.getEducations(userId);
  sendSuccess(res, 'Educations retrieved successfully', educations);
};

export const getEducationHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = req.user!.id;
  const education = await educationService.getEducationById(userId, req.params.id);
  sendSuccess(res, 'Education retrieved successfully', education);
};

export const updateEducationHandler = async (
  req: Request<{ id: string }, object, UpdateEducationInput>,
  res: Response
) => {
  const userId = req.user!.id;
  const education = await educationService.updateEducation(
    userId,
    req.params.id,
    req.body
  );
  sendSuccess(res, 'Education updated successfully', education);
};

export const deleteEducationHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = req.user!.id;
  await educationService.deleteEducation(userId, req.params.id);
  sendSuccess(res, 'Education deleted successfully', null, 204);
};
