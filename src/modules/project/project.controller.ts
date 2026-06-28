import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/utils/index.js';
import { sendSuccess } from '../../shared/responses/index.js';
import * as projectService from './project.service.js';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsQueryInput,
} from './project.schema.js';

export const createProjectHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const project = await projectService.createProject(
      userId,
      req.body as CreateProjectInput
    );

    sendSuccess(res, 'Project created successfully', project, 201);
  }
);

export const getProjectsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await projectService.getProjects(
      userId,
      req.query as unknown as ListProjectsQueryInput
    );

    sendSuccess(res, 'Projects retrieved successfully', result);
  }
);

export const getProjectHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const project = await projectService.getProjectById(userId, id as string);

    sendSuccess(res, 'Project retrieved successfully', project);
  }
);

export const updateProjectHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const project = await projectService.updateProject(
      userId,
      id as string,
      req.body as UpdateProjectInput
    );

    sendSuccess(res, 'Project updated successfully', project);
  }
);

export const deleteProjectHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    await projectService.deleteProject(userId, id as string);

    sendSuccess(res, 'Project deleted successfully', null);
  }
);
