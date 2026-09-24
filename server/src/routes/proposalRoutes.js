import express from 'express';
import {
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  sendProposal,
  approveProposal,
  rejectProposal,
  requestRevision,
} from '../controllers/proposalController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProposals);
router.post('/', authorize('DESIGNER', 'ADMIN'), createProposal);
router.get('/:id', getProposalById);
router.put('/:id', authorize('DESIGNER', 'ADMIN'), updateProposal);
router.patch('/:id/send', authorize('DESIGNER', 'ADMIN'), sendProposal);
router.patch('/:id/approve', authorize('CLIENT', 'ADMIN'), approveProposal);
router.patch('/:id/reject', authorize('CLIENT', 'ADMIN'), rejectProposal);
router.post('/:id/revisions', authorize('CLIENT', 'ADMIN'), requestRevision);

export default router;
