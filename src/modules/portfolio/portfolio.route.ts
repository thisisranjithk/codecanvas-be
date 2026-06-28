import { Router } from 'express';
import * as controller from './portfolio.controller.js';

const router = Router();

router.get('/:username', controller.getPortfolioHomepageHandler);
router.get('/:username/projects', controller.getPortfolioProjectsHandler);
router.get('/:username/projects/:id', controller.getPortfolioProjectByIdHandler);
router.get('/:username/blogs', controller.getPortfolioBlogsHandler);
router.get('/:username/blogs/:slug', controller.getPortfolioBlogBySlugHandler);

export { router as portfolioRoutes };
