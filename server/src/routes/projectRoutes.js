import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  assignProfessional,
  updateProjectStatus,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', authorize('CLIENT', 'ADMIN'), createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.patch('/:id/assign', authorize('CLIENT', 'ADMIN'), assignProfessional);
router.patch('/:id/status', updateProjectStatus);
router.delete('/:id', authorize('CLIENT', 'ADMIN'), deleteProject);

export default router;
