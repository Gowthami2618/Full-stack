import express from 'express';
import {
  getUsers,
  getProfessionals,
  getUserById,
  toggleUserStatus,
  verifyUser,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Public/authenticated directory of designers & contractors
router.get('/professionals', getProfessionals);

// Admin-only user management
router.get('/', authorize('ADMIN'), getUsers);
router.get('/:id', getUserById);
router.patch('/:id/toggle-status', authorize('ADMIN'), toggleUserStatus);
router.patch('/:id/verify', authorize('ADMIN'), verifyUser);

export default router;
