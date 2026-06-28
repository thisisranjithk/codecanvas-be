import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/utils/index.js';
import { sendSuccess } from '../../shared/responses/index.js';
import * as skillService from './skill.service.js';
import type {
  CreateSkillInput,
  UpdateSkillInput,
} from './skill.schema.js';

export const createSkillHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const skill = await skillService.createSkill(
      userId,
      req.body as CreateSkillInput
    );

    sendSuccess(res, 'Skill created successfully', skill, 201);
  }
);

export const getSkillsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await skillService.getSkills(userId);

    sendSuccess(res, 'Skills retrieved successfully', result);
  }
);

export const getSkillHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const skill = await skillService.getSkillById(userId, id as string);

    sendSuccess(res, 'Skill retrieved successfully', skill);
  }
);

export const updateSkillHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const skill = await skillService.updateSkill(
      userId,
      id as string,
      req.body as UpdateSkillInput
    );

    sendSuccess(res, 'Skill updated successfully', skill);
  }
);

export const deleteSkillHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    await skillService.deleteSkill(userId, id as string);

    sendSuccess(res, 'Skill deleted successfully', null);
  }
);
