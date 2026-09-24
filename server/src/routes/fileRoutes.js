import express from 'express';
import {
  getFiles,
  uploadFile,
  deleteFile,
} from '../controllers/fileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

export default router;
