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
  generateRoomAIProposal,
  convertAIToProjectData,
  createQuotation,
  reviewQuotation,
  recordApprovalDecision,
  addSiteVisit,
  addProjectIssue,
  updateProjectIssue,
  addProjectSnag,
  updateProjectSnag,
  addProcurementItem,
  completeProjectHandover,
  addRoomMoodboardItem,
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

// AI Design Proposal & Conversion Routes
router.post('/:id/rooms/:roomId/ai-proposal', generateRoomAIProposal);
router.post('/:id/rooms/:roomId/convert-ai', authorize('DESIGNER', 'ADMIN'), convertAIToProjectData);
router.post('/:id/rooms/:roomId/moodboard', addRoomMoodboardItem);

// Quotations, Approvals & Handover
router.post('/:id/quotations', authorize('DESIGNER', 'ADMIN'), createQuotation);
router.post('/:id/quotations/:quoteId/review', authorize('CLIENT', 'ADMIN'), reviewQuotation);
router.post('/:id/approvals', recordApprovalDecision);
router.post('/:id/site-visits', addSiteVisit);
router.post('/:id/issues', addProjectIssue);
router.patch('/:id/issues/:issueId', updateProjectIssue);
router.post('/:id/snags', addProjectSnag);
router.patch('/:id/snags/:snagId', updateProjectSnag);
router.post('/:id/procurement', addProcurementItem);
router.post('/:id/handover', authorize('CLIENT', 'ADMIN'), completeProjectHandover);

export default router;

