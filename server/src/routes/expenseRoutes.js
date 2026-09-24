import express from 'express';
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);

export default router;
