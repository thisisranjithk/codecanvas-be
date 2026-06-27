import multer from 'multer';
import { BadRequestError } from '../errors/index.js';

// 2MB in bytes
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Invalid file type. Only JPG, JPEG, PNG, WEBP, SVG, and PDF are allowed.'));
    }
  },
});
