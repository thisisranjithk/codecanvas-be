import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/responses/index.js';
import { asyncHandler } from '../../shared/utils/index.js';
import * as portfolioService from './portfolio.service.js';
import { listProjectsQuerySchema } from '../project/project.schema.js';
import { listBlogsQuerySchema } from '../blog/blog.schema.js';

export const getPortfolioHomepageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const data = await portfolioService.getPortfolioHomepage(username as string);
    sendSuccess(res, 'Portfolio data retrieved successfully.', data);
  },
);

export const getPortfolioProjectsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const query = listProjectsQuerySchema.parse(req.query);
    const data = await portfolioService.getPortfolioProjects(username as string, query);
    sendSuccess(res, 'Projects retrieved successfully.', data);
  },
);

export const getPortfolioProjectByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, id } = req.params;
    const project = await portfolioService.getPortfolioProjectById(
      username as string,
      id as string,
    );
    sendSuccess(res, 'Project retrieved successfully.', project);
  },
);

export const getPortfolioBlogsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const query = listBlogsQuerySchema.parse(req.query);
    const data = await portfolioService.getPortfolioBlogs(username as string, query);
    sendSuccess(res, 'Blogs retrieved successfully.', data);
  },
);

export const getPortfolioBlogBySlugHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, slug } = req.params;
    const blog = await portfolioService.getPortfolioBlogBySlug(
      username as string,
      slug as string,
    );
    sendSuccess(res, 'Blog retrieved successfully.', blog);
  },
);
