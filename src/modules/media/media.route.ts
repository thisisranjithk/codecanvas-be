import { Router } from 'express';
import { mediaController } from './media.controller.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { upload } from '../../shared/middleware/upload.js';
import { validate } from '../../shared/middleware/validate.js';
import { UploadMediaSchema } from './media.schema.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';

const router = Router();

// All media routes are protected
router.use(authenticate);

router.post(
  '/upload',
  upload.single('file'),
  validate(UploadMediaSchema),
  asyncHandler(mediaController.uploadMedia)
);

router.get(
  '/:id',
  asyncHandler(mediaController.getMedia)
);

router.delete(
  '/:id',
  asyncHandler(mediaController.deleteMedia)
);

export const mediaRouter = router;
