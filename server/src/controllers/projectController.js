import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all projects with role-based filtering, search, and pagination
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Role-based access filtering
    if (req.user.role === 'CLIENT') {
      query.client = req.user._id;
    } else if (req.user.role === 'DESIGNER') {
      // Assigned to designer OR open requested projects available for proposal bidding
      if (req.query.scope === 'assigned') {
        query.designer = req.user._id;
      } else {
        query.$or = [{ designer: req.user._id }, { status: 'REQUESTED' }];
      }
    } else if (req.user.role === 'CONTRACTOR') {
      // Assigned to contractor OR approved projects ready for execution
      if (req.query.scope === 'assigned') {
        query.contractor = req.user._id;
      } else {
        query.$or = [{ contractor: req.user._id }, { status: 'APPROVED' }];
      }
    }
    // ADMIN has full access across all projects

    // Search query by title or location
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'ALL') {
      query.status = req.query.status;
    }

    // Filter by projectType
    if (req.query.projectType && req.query.projectType !== 'ALL') {
      query.projectType = req.query.projectType;
    }

    // Filter by propertyType
    if (req.query.propertyType && req.query.propertyType !== 'ALL') {
      query.propertyType = req.query.propertyType;
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('client', 'name email phone profileImage location')
      .populate('designer', 'name email phone profileImage isVerified')
      .populate('contractor', 'name email phone profileImage isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendSuccess(
      res,
      200,
      'Projects retrieved successfully',
      projects,
      {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID with deep ownership verification
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email phone profileImage bio location')
      .populate('designer', 'name email phone profileImage bio location isVerified')
      .populate('contractor', 'name email phone profileImage bio location isVerified');

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Resource Authorization check
    const isOwner =
      req.user.role === 'ADMIN' ||
      (project.client && project.client._id.toString() === req.user._id.toString()) ||
      (project.designer && project.designer._id.toString() === req.user._id.toString()) ||
      (project.contractor && project.contractor._id.toString() === req.user._id.toString()) ||
      // Or if requested/approved and browsing marketplace
      (req.user.role === 'DESIGNER' && project.status === 'REQUESTED') ||
      (req.user.role === 'CONTRACTOR' && project.status === 'APPROVED');

    if (!isOwner) {
      return sendError(
        res,
        403,
        'Access denied. You do not have permission to view this project.'
      );
    }

    return sendSuccess(res, 200, 'Project retrieved', project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (CLIENT, ADMIN)
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      projectType,
      propertyType,
      location,
      totalBudget,
      startDate,
      expectedEndDate,
      requirements,
      preferredStyle,
      images,
      designerId,
    } = req.body;

    if (!title || !description || !projectType || !propertyType || !location || !totalBudget) {
      return sendError(res, 400, 'Please provide all required project fields.');
    }

    const clientId = req.user.role === 'ADMIN' && req.body.clientId ? req.body.clientId : req.user._id;

    const project = await Project.create({
      title,
      description,
      client: clientId,
      designer: designerId || null,
      projectType,
      propertyType,
      location,
      totalBudget: Number(totalBudget),
      startDate: startDate || Date.now(),
      expectedEndDate: expectedEndDate || null,
      requirements: requirements || '',
      preferredStyle: preferredStyle || 'Modern',
      images: images || [],
      status: designerId ? 'DESIGNING' : 'REQUESTED',
    });

    // Notify admins & assigned designer if applicable
    if (designerId) {
      await Notification.create({
        recipient: designerId,
        type: 'DESIGNER_ASSIGNED',
        title: 'Assigned to New Project',
        message: `You have been assigned as lead designer for project: ${project.title}`,
        relatedProject: project._id,
      });
    }

    // Notify client confirmation
    await Notification.create({
      recipient: clientId,
      type: 'NEW_PROJECT',
      title: 'Project Created Successfully',
      message: `Your project "${project.title}" has been created and is now visible to interior designers.`,
      relatedProject: project._id,
    });

    await logActivity({
      user: req.user,
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Project created: "${project.title}" by ${req.user.name}`,
      metadata: { totalBudget, projectType, propertyType },
    });

    const populatedProject = await Project.findById(project._id)
      .populate('client', 'name email phone profileImage')
      .populate('designer', 'name email phone profileImage');

    return sendSuccess(res, 201, 'Project created successfully', populatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Permission check
    const isClient = project.client.toString() === req.user._id.toString();
    const isDesigner = project.designer && project.designer.toString() === req.user._id.toString();
    const isContractor = project.contractor && project.contractor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isDesigner && !isContractor && !isAdmin) {
      return sendError(res, 403, 'You do not have authorization to edit this project.');
    }

    const updates = { ...req.body };

    // Prevent non-admins from changing project client
    if (!isAdmin) {
      delete updates.client;
    }

    // Client can edit specs if project not yet finished
    if (isClient && !isAdmin) {
      // Client shouldn't directly override contractor without workflow
    }

    project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('client', 'name email phone profileImage')
      .populate('designer', 'name email phone profileImage')
      .populate('contractor', 'name email phone profileImage');

    await logActivity({
      user: req.user,
      action: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Project "${project.title}" updated by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Project updated successfully', project);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign professionals to project (Designer or Contractor)
// @route   PATCH /api/projects/:id/assign
// @access  Private (CLIENT, ADMIN)
export const assignProfessional = async (req, res, next) => {
  try {
    const { designerId, contractorId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return sendError(res, 403, 'Only project client or admin can assign professionals.');
    }

    if (designerId) {
      project.designer = designerId;
      if (project.status === 'REQUESTED') {
        project.status = 'DESIGNING';
      }
      await Notification.create({
        recipient: designerId,
        type: 'DESIGNER_ASSIGNED',
        title: 'Project Assignment',
        message: `You have been selected as the interior designer for "${project.title}"`,
        relatedProject: project._id,
      });
    }

    if (contractorId) {
      project.contractor = contractorId;
      if (project.status === 'APPROVED') {
        project.status = 'IN_PROGRESS';
      }
      await Notification.create({
        recipient: contractorId,
        type: 'CONTRACTOR_ASSIGNED',
        title: 'Project Execution Assignment',
        message: `You have been assigned as the contractor for "${project.title}"`,
        relatedProject: project._id,
      });
    }

    await project.save();

    await logActivity({
      user: req.user,
      action: 'PROFESSIONAL_ASSIGNED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Professional assigned to "${project.title}" by ${req.user.name}`,
    });

    const updated = await Project.findById(project._id)
      .populate('client', 'name email phone profileImage')
      .populate('designer', 'name email phone profileImage')
      .populate('contractor', 'name email phone profileImage');

    return sendSuccess(res, 200, 'Professional assigned successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project progress and status
// @route   PATCH /api/projects/:id/status
// @access  Private
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { status, progress } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const isClient = project.client.toString() === req.user._id.toString();
    const isDesigner = project.designer && project.designer.toString() === req.user._id.toString();
    const isContractor = project.contractor && project.contractor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isDesigner && !isContractor && !isAdmin) {
      return sendError(res, 403, 'Unauthorized to change project status.');
    }

    if (status) project.status = status;
    if (progress !== undefined) project.progress = Number(progress);

    await project.save();

    // Broadcast notification to project stakeholders
    const stakeholders = [project.client, project.designer, project.contractor].filter(
      (id) => id && id.toString() !== req.user._id.toString()
    );

    for (const stakeholderId of stakeholders) {
      await Notification.create({
        recipient: stakeholderId,
        type: 'SYSTEM',
        title: 'Project Status Updated',
        message: `Status of "${project.title}" changed to ${project.status} (${project.progress}% completed).`,
        relatedProject: project._id,
      });
    }

    await logActivity({
      user: req.user,
      action: 'STATUS_UPDATED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Project "${project.title}" status updated to ${project.status} (${project.progress}%) by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Project status updated successfully', project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (CLIENT / ADMIN)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return sendError(res, 403, 'Only project owner or admin can delete this project.');
    }

    await Project.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.user,
      action: 'PROJECT_DELETED',
      entityType: 'PROJECT',
      entityId: req.params.id,
      description: `Project "${project.title}" deleted by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};
