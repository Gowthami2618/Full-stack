import express from 'express';
import {
  getAdminAnalytics,
  getClientAnalytics,
  getDesignerAnalytics,
  getContractorAnalytics,
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/admin', authorize('ADMIN'), getAdminAnalytics);
router.get('/client', authorize('CLIENT', 'ADMIN'), getClientAnalytics);
router.get('/designer', authorize('DESIGNER', 'ADMIN'), getDesignerAnalytics);
router.get('/contractor', authorize('CONTRACTOR', 'ADMIN'), getContractorAnalytics);

export default router;
