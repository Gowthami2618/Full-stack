import express from 'express';
import {
  getRevisions,
  updateRevisionStatus,
} from '../controllers/revisionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getRevisions);
router.patch('/:id/status', updateRevisionStatus);

export default router;
