import express from 'express';
import {
  getFurnitureCatalog,
  getMaterialCatalog,
  addFurnitureToProject,
  addMaterialToProject,
} from '../controllers/catalogController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Authenticated catalog reading
router.get('/furniture', getFurnitureCatalog);
router.get('/materials', getMaterialCatalog);

// Authenticated project association
router.post('/add-furniture-to-project', authenticate, addFurnitureToProject);
router.post('/add-material-to-project', authenticate, addMaterialToProject);

export default router;
