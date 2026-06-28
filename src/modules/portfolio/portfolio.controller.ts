import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/responses/index.js';
import * as portfolioService from './portfolio.service.js';
import { listProjectsQuerySchema } from '../project/project.schema.js';
import { listBlogsQuerySchema } from '../blog/blog.schema.js';

export const getPortfolioHomepageHandler = async (_req: Request, res: Response) => {
  const data = await portfolioService.getPortfolioHomepage();
  sendSuccess(res, 'Portfolio data retrieved successfully', data, 200);
};

export const getPortfolioProjectsHandler = async (req: Request, res: Response) => {
  const query = listProjectsQuerySchema.parse(req.query);
  const data = await portfolioService.getPortfolioProjects(query);
  sendSuccess(res, 'Projects retrieved successfully', data, 200);
};

export const getPortfolioProjectByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const project = await portfolioService.getPortfolioProjectById(id);
  sendSuccess(res, 'Project retrieved successfully', project, 200);
};

export const getPortfolioBlogsHandler = async (req: Request, res: Response) => {
  const query = listBlogsQuerySchema.parse(req.query);
  const data = await portfolioService.getPortfolioBlogs(query);
  sendSuccess(res, 'Blogs retrieved successfully', data, 200);
};

export const getPortfolioBlogBySlugHandler = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const blog = await portfolioService.getPortfolioBlogBySlug(slug);
  sendSuccess(res, 'Blog retrieved successfully', blog, 200);
};
