import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN'), getAuditLogs);

export default router;
