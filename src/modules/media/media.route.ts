import { Router } from 'express';
import * as mediaController from './media.controller.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { upload } from '../../shared/middleware/upload.js';
import { validate } from '../../shared/middleware/validate.js';
import { UploadMediaSchema } from './media.schema.js';

const router = Router();

// All media routes are protected
router.use(authenticate);

router.post(
  '/upload',
  upload.single('file'),
  validate(UploadMediaSchema),
  mediaController.uploadMediaHandler
);

router.get(
  '/:id',
  mediaController.getMediaHandler
);

router.delete(
  '/:id',
  mediaController.deleteMediaHandler
);

export const mediaRouter = router;
