import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  addTaskComment,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.post('/:id/comments', addTaskComment);
router.delete('/:id', deleteTask);

export default router;
