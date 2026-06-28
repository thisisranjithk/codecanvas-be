import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import * as controller from './portfolio.controller.js';

const router = Router();

router.get('/', asyncHandler(controller.getPortfolioHomepageHandler));
router.get('/projects', asyncHandler(controller.getPortfolioProjectsHandler));
router.get('/projects/:id', asyncHandler(controller.getPortfolioProjectByIdHandler));
router.get('/blogs', asyncHandler(controller.getPortfolioBlogsHandler));
router.get('/blogs/:slug', asyncHandler(controller.getPortfolioBlogBySlugHandler));

export { router as portfolioRoutes };
