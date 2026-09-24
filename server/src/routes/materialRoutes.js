import express from 'express';
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../controllers/materialController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;
