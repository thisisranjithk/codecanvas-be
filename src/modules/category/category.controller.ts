import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/index.js';
import { sendSuccess } from '../../shared/responses/index.js';
import * as categoryService from './category.service.js';
import type { CreateCategoryInput, UpdateCategoryInput, GetCategoryDropdownQuery } from './category.schema.js';

export const createCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateCategoryInput;
    const category = await categoryService.create(data);
    sendSuccess(res, 'Category created successfully', category, 201);
  }
);

export const getCategoriesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.findAll();
    sendSuccess(res, 'Categories retrieved successfully', categories);
  }
);

export const getCategoryByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const category = await categoryService.findById(id);
    sendSuccess(res, 'Category retrieved successfully', category);
  }
);

export const updateCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = req.body as UpdateCategoryInput;
    const category = await categoryService.update(id, data);
    sendSuccess(res, 'Category updated successfully', category);
  }
);

export const deleteCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await categoryService.deleteCategory(id);
    res.status(204).send();
  }
);

export const getCategoryDropdownHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as GetCategoryDropdownQuery;
    const categories = await categoryService.getDropdown(query);
    sendSuccess(res, 'Category dropdown retrieved successfully', categories);
  }
);
