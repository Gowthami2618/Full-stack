import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  assignProfessional,
  updateProjectStatus,
  deleteProject,
  addRoom,
  updateRoom,
  deleteRoom,
  reviewRoomDesign,
  addHousePhoto,
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

// Room & House Photo Routes
router.post('/:id/rooms', addRoom);
router.patch('/:id/rooms/:roomId', updateRoom);
router.delete('/:id/rooms/:roomId', deleteRoom);
router.post('/:id/rooms/:roomId/review', authorize('CLIENT', 'ADMIN'), reviewRoomDesign);
router.post('/:id/photos', addHousePhoto);

export default router;

