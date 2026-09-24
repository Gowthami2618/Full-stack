import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
