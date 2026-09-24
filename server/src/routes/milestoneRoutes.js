import express from 'express';
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../controllers/milestoneController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMilestones);
router.post('/', createMilestone);
router.put('/:id', updateMilestone);
router.delete('/:id', deleteMilestone);

export default router;
