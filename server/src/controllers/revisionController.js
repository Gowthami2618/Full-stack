import Revision from '../models/Revision.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get revisions for a proposal or project
// @route   GET /api/revisions
// @access  Private
export const getRevisions = async (req, res, next) => {
  try {
    const { proposalId, projectId } = req.query;
    const query = {};

    if (proposalId) query.proposal = proposalId;
    if (projectId) query.project = projectId;

    const revisions = await Revision.find(query)
      .populate('requestedBy', 'name email profileImage role')
      .populate('proposal', 'title status designer')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Revisions retrieved', revisions);
  } catch (error) {
    next(error);
  }
};

// @desc    Update revision status (e.g. IN_PROGRESS, RESOLVED)
// @route   PATCH /api/revisions/:id/status
// @access  Private
export const updateRevisionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const revision = await Revision.findById(req.params.id)
      .populate('requestedBy')
      .populate('project');

    if (!revision) {
      return sendError(res, 404, 'Revision not found');
    }

    if (status) revision.status = status;
    await revision.save();

    if (status === 'RESOLVED') {
      await Notification.create({
        recipient: revision.requestedBy._id,
        type: 'REVISION_RESOLVED',
        title: 'Design Revision Resolved',
        message: `Your requested changes have been addressed by the designer.`,
        relatedProject: revision.project._id,
      });
    }

    await logActivity({
      user: req.user,
      action: 'REVISION_STATUS_UPDATED',
      entityType: 'REVISION',
      entityId: revision._id,
      description: `Revision status updated to ${status} by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Revision status updated', revision);
  } catch (error) {
    next(error);
  }
};
