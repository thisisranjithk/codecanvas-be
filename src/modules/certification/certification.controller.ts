import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as certificationService from './certification.service.js';

export const createCertification = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const certification = await certificationService.createCertification(userId, req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: certification,
  });
};

export const getCertifications = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const certifications = await certificationService.getCertifications(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: certifications,
  });
};

export const getCertificationById = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const certification = await certificationService.getCertificationById(userId, id as string);

  res.status(StatusCodes.OK).json({
    success: true,
    data: certification,
  });
};

export const updateCertification = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const certification = await certificationService.updateCertification(userId, id as string, req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    data: certification,
  });
};

export const deleteCertification = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await certificationService.deleteCertification(userId, id as string);

  res.status(StatusCodes.NO_CONTENT).send();
};
