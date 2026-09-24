import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all milestones for a project
// @route   GET /api/milestones
// @access  Private
export const getMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return sendError(res, 400, 'Project ID is required.');
    }

    const milestones = await Milestone.find({ project: projectId }).sort({ dueDate: 1 });
    return sendSuccess(res, 200, 'Milestones retrieved', milestones);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new milestone
// @route   POST /api/milestones
// @access  Private
export const createMilestone = async (req, res, next) => {
  try {
    const { projectId, title, description, startDate, dueDate, status, completionPercentage } =
      req.body;

    if (!projectId || !title || !dueDate) {
      return sendError(res, 400, 'Project ID, title, and due date are required.');
    }

    const milestone = await Milestone.create({
      project: projectId,
      title,
      description: description || '',
      startDate: startDate || Date.now(),
      dueDate,
      status: status || 'UPCOMING',
      completionPercentage: Number(completionPercentage) || 0,
    });

    await logActivity({
      user: req.user,
      action: 'MILESTONE_CREATED',
      entityType: 'MILESTONE',
      entityId: milestone._id,
      description: `Milestone "${milestone.title}" created`,
    });

    return sendSuccess(res, 201, 'Milestone created successfully', milestone);
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone
// @route   PUT /api/milestones/:id
// @access  Private
export const updateMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return sendError(res, 404, 'Milestone not found');
    }

    const updated = await Milestone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify project client and stakeholders
    const project = await Project.findById(milestone.project);
    if (project && project.client) {
      await Notification.create({
        recipient: project.client,
        type: 'MILESTONE_UPDATED',
        title: 'Milestone Progress Updated',
        message: `Milestone "${updated.title}" updated to ${updated.status} (${updated.completionPercentage}% complete).`,
        relatedProject: project._id,
      });
    }

    await logActivity({
      user: req.user,
      action: 'MILESTONE_UPDATED',
      entityType: 'MILESTONE',
      entityId: updated._id,
      description: `Milestone "${updated.title}" updated by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Milestone updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
// @access  Private
export const deleteMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return sendError(res, 404, 'Milestone not found');
    }

    await Milestone.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.user,
      action: 'MILESTONE_DELETED',
      entityType: 'MILESTONE',
      entityId: req.params.id,
      description: `Milestone "${milestone.title}" deleted by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Milestone deleted successfully');
  } catch (error) {
    next(error);
  }
};
