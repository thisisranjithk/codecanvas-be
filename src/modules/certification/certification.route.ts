import { Router } from 'express';
import { authenticate, validate } from '../../shared/middleware/index.js';
import * as controller from './certification.controller.js';
import {
  createCertificationSchema,
  updateCertificationSchema,
  certificationIdParamSchema,
} from './certification.schema.js';

const router = Router();

// All routes are protected
router.use(authenticate);

router.post(
  '/',
  validate(createCertificationSchema),
  controller.createCertification
);

router.get('/', controller.getCertifications);

router.get(
  '/:id',
  validate(certificationIdParamSchema, 'params'),
  controller.getCertificationById
);

router.put(
  '/:id',
  validate(certificationIdParamSchema, 'params'),
  validate(updateCertificationSchema, 'body'),
  controller.updateCertification
);

router.delete(
  '/:id',
  validate(certificationIdParamSchema, 'params'),
  controller.deleteCertification
);

export default router;
