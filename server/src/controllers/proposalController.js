import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';
import Revision from '../models/Revision.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all proposals for a project or designer
// @route   GET /api/proposals
// @access  Private
export const getProposals = async (req, res, next) => {
  try {
    const { projectId, designerId } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (designerId) query.designer = designerId;

    // Role-based restrictions
    if (req.user.role === 'DESIGNER' && !projectId) {
      query.designer = req.user._id;
    }

    const proposals = await Proposal.find(query)
      .populate('designer', 'name email phone profileImage isVerified')
      .populate('project', 'title totalBudget client status')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Proposals retrieved successfully', proposals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
export const getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('designer', 'name email phone profileImage isVerified bio')
      .populate('project', 'title description client designer contractor totalBudget status preferredStyle');

    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    return sendSuccess(res, 200, 'Proposal retrieved', proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new proposal
// @route   POST /api/proposals
// @access  Private (DESIGNER, ADMIN)
export const createProposal = async (req, res, next) => {
  try {
    const {
      projectId,
      title,
      description,
      designStyle,
      estimatedCost,
      estimatedDuration,
      materials,
      designImages,
      notes,
      sendImmediately,
    } = req.body;

    if (!projectId || !title || !description || !estimatedCost || !estimatedDuration) {
      return sendError(res, 400, 'Please provide all required proposal fields.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 404, 'Target project not found');
    }

    const initialStatus = sendImmediately ? 'SENT' : 'DRAFT';

    const proposal = await Proposal.create({
      project: projectId,
      designer: req.user._id,
      title,
      description,
      designStyle: designStyle || project.preferredStyle || 'Modern',
      estimatedCost: Number(estimatedCost),
      estimatedDuration,
      materials: materials || [],
      designImages: designImages || [],
      notes: notes || '',
      status: initialStatus,
    });

    if (sendImmediately) {
      project.status = 'PROPOSAL_SENT';
      if (!project.designer) project.designer = req.user._id;
      await project.save();

      // Notify client
      await Notification.create({
        recipient: project.client,
        type: 'PROPOSAL_SUBMITTED',
        title: 'New Design Proposal Received',
        message: `Designer ${req.user.name} submitted a design proposal "${proposal.title}" for your review.`,
        relatedProject: project._id,
      });
    }

    await logActivity({
      user: req.user,
      action: 'PROPOSAL_CREATED',
      entityType: 'PROPOSAL',
      entityId: proposal._id,
      description: `Proposal "${proposal.title}" created for project "${project.title}" by ${req.user.name}`,
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate('designer', 'name email profileImage')
      .populate('project', 'title totalBudget client');

    return sendSuccess(res, 201, 'Proposal created successfully', populatedProposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update proposal details
// @route   PUT /api/proposals/:id
// @access  Private (DESIGNER, ADMIN)
export const updateProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    if (
      proposal.designer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return sendError(res, 403, 'Unauthorized to edit this proposal.');
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('designer', 'name email profileImage');

    await logActivity({
      user: req.user,
      action: 'PROPOSAL_UPDATED',
      entityType: 'PROPOSAL',
      entityId: proposal._id,
      description: `Proposal "${proposal.title}" updated by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Proposal updated successfully', updatedProposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Send proposal to client for review
// @route   PATCH /api/proposals/:id/send
// @access  Private (DESIGNER, ADMIN)
export const sendProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');

    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    if (
      proposal.designer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return sendError(res, 403, 'Unauthorized to send this proposal.');
    }

    proposal.status = 'SENT';
    await proposal.save();

    const project = await Project.findById(proposal.project._id);
    project.status = 'PROPOSAL_SENT';
    if (!project.designer) project.designer = req.user._id;
    await project.save();

    await Notification.create({
      recipient: project.client,
      type: 'PROPOSAL_SUBMITTED',
      title: 'Design Proposal Ready',
      message: `Designer ${req.user.name} submitted the proposal "${proposal.title}" for project "${project.title}".`,
      relatedProject: project._id,
    });

    await logActivity({
      user: req.user,
      action: 'PROPOSAL_SENT',
      entityType: 'PROPOSAL',
      entityId: proposal._id,
      description: `Proposal "${proposal.title}" submitted to client`,
    });

    return sendSuccess(res, 200, 'Proposal sent to client successfully', proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve proposal
// @route   PATCH /api/proposals/:id/approve
// @access  Private (CLIENT, ADMIN)
export const approveProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');

    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    const project = await Project.findById(proposal.project._id);
    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return sendError(res, 403, 'Only the client or admin can approve proposals.');
    }

    proposal.status = 'APPROVED';
    await proposal.save();

    project.status = 'APPROVED';
    project.designer = proposal.designer;
    await project.save();

    // Notify designer
    await Notification.create({
      recipient: proposal.designer,
      type: 'PROPOSAL_APPROVED',
      title: 'Proposal Approved!',
      message: `Great news! The client approved your design proposal "${proposal.title}" for "${project.title}".`,
      relatedProject: project._id,
    });

    await logActivity({
      user: req.user,
      action: 'PROPOSAL_APPROVED',
      entityType: 'PROPOSAL',
      entityId: proposal._id,
      description: `Proposal "${proposal.title}" approved by client ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Proposal approved successfully', proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject proposal
// @route   PATCH /api/proposals/:id/reject
// @access  Private (CLIENT, ADMIN)
export const rejectProposal = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const proposal = await Proposal.findById(req.params.id).populate('project');

    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    const project = await Project.findById(proposal.project._id);
    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return sendError(res, 403, 'Only the client or admin can reject proposals.');
    }

    proposal.status = 'REJECTED';
    if (reason) {
      proposal.notes = proposal.notes ? `${proposal.notes}\nRejection Reason: ${reason}` : `Rejection Reason: ${reason}`;
    }
    await proposal.save();

    await Notification.create({
      recipient: proposal.designer,
      type: 'PROPOSAL_REJECTED',
      title: 'Proposal Declined',
      message: `The proposal "${proposal.title}" was declined by the client.${reason ? ` Reason: ${reason}` : ''}`,
      relatedProject: project._id,
    });

    await logActivity({
      user: req.user,
      action: 'PROPOSAL_REJECTED',
      entityType: 'PROPOSAL',
      entityId: proposal._id,
      description: `Proposal "${proposal.title}" rejected by client ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Proposal rejected', proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Request revision on proposal
// @route   POST /api/proposals/:id/revisions
// @access  Private (CLIENT, ADMIN)
export const requestRevision = async (req, res, next) => {
  try {
    const { message, requestedChanges, attachments } = req.body;

    if (!message) {
      return sendError(res, 400, 'Please provide revision feedback/instructions.');
    }

    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) {
      return sendError(res, 404, 'Proposal not found');
    }

    const project = await Project.findById(proposal.project._id);
    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return sendError(res, 403, 'Only project client can request design revisions.');
    }

    const revision = await Revision.create({
      proposal: proposal._id,
      project: project._id,
      requestedBy: req.user._id,
      message,
      requestedChanges: requestedChanges || [],
      attachments: attachments || [],
      status: 'OPEN',
    });

    proposal.status = 'REVISION_REQUESTED';
    await proposal.save();

    project.status = 'DESIGNING';
    await project.save();

    // Notify designer
    await Notification.create({
      recipient: proposal.designer,
      type: 'REVISION_REQUESTED',
      title: 'Design Revision Requested',
      message: `Client ${req.user.name} requested modifications on proposal "${proposal.title}": ${message}`,
      relatedProject: project._id,
    });

    await logActivity({
      user: req.user,
      action: 'REVISION_REQUESTED',
      entityType: 'REVISION',
      entityId: revision._id,
      description: `Revision requested on proposal "${proposal.title}" by ${req.user.name}`,
    });

    const populatedRevision = await Revision.findById(revision._id).populate(
      'requestedBy',
      'name email profileImage'
    );

    return sendSuccess(res, 201, 'Revision request submitted', populatedRevision);
  } catch (error) {
    next(error);
  }
};
