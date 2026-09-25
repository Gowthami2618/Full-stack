import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { analyzeRoomImageAndGenerateProposal } from '../utils/aiDesignService.js';

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

    // Standard initial rooms if not customized
    const initialRooms = (rooms && Array.isArray(rooms) && rooms.length > 0)
      ? rooms
      : [
          { name: 'Living Room', category: 'Living', dimensions: '18 x 14 ft', area: 252, budget: Math.round(Number(totalBudget) * 0.2), style: preferredStyle || 'Modern' },
          { name: 'Dining Room', category: 'Dining', dimensions: '14 x 12 ft', area: 168, budget: Math.round(Number(totalBudget) * 0.1), style: preferredStyle || 'Modern' },
          { name: 'Kitchen', category: 'Kitchen', dimensions: '12 x 10 ft', area: 120, budget: Math.round(Number(totalBudget) * 0.2), style: preferredStyle || 'Modern', kitchenDetails: { layout: 'L-shaped', components: [] } },
          { name: 'Master Bedroom', category: 'Bedroom', dimensions: '16 x 14 ft', area: 224, budget: Math.round(Number(totalBudget) * 0.2), style: preferredStyle || 'Modern' },
          { name: 'Bedroom 2', category: 'Bedroom', dimensions: '14 x 12 ft', area: 168, budget: Math.round(Number(totalBudget) * 0.1), style: preferredStyle || 'Modern' },
          { name: 'Bathroom 1', category: 'Bathroom', dimensions: '8 x 6 ft', area: 48, budget: Math.round(Number(totalBudget) * 0.08), style: preferredStyle || 'Modern' },
          { name: 'Balcony', category: 'Outdoor', dimensions: '12 x 5 ft', area: 60, budget: Math.round(Number(totalBudget) * 0.05), style: preferredStyle || 'Modern' },
        ];

    const project = await Project.create({
      title,
      description,
      client: clientId,
      designer: designerId || null,
      projectType: projectType || 'Full Home',
      propertyType: propertyType || 'Villa',
      location,
      totalBudget: Number(totalBudget),
      startDate: startDate || Date.now(),
      expectedEndDate: expectedEndDate || null,
      requirements: requirements || '',
      preferredStyle: preferredStyle || 'Modern',
      images: images || [],
      status: designerId ? 'DESIGNING' : 'REQUESTED',
      propertyDetails: propertyDetails || {},
      budgetAllocation: budgetAllocation || {
        totalBudget: Number(totalBudget),
        interior: Math.round(Number(totalBudget) * 0.4),
        furniture: Math.round(Number(totalBudget) * 0.2),
        kitchen: Math.round(Number(totalBudget) * 0.15),
        bathrooms: Math.round(Number(totalBudget) * 0.1),
        contingency: Math.round(Number(totalBudget) * 0.15),
      },
      housePhotos: housePhotos || [],
      rooms: initialRooms,
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

// @desc    Add a new room/space to a house project
// @route   POST /api/projects/:id/rooms
// @access  Private
export const addRoom = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const { name, category, dimensions, area, budget, style } = req.body;
    if (!name) {
      return sendError(res, 400, 'Room name is required');
    }

    project.rooms.push({
      name,
      category: category || 'General',
      dimensions: dimensions || '',
      area: Number(area) || 0,
      budget: Number(budget) || 0,
      style: style || project.preferredStyle || 'Modern',
      designStatus: 'Draft',
      executionStatus: 'Pending',
    });

    await project.save();

    return sendSuccess(res, 201, 'Room added successfully', project.rooms[project.rooms.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room's design, planner details, or execution progress
// @route   PATCH /api/projects/:id/rooms/:roomId
// @access  Private
export const updateRoom = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const room = project.rooms.id(req.params.roomId);
    if (!room) {
      return sendError(res, 404, 'Room not found');
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== '_id') {
        room[key] = updates[key];
      }
    });

    // Automatically recalculate overall project progress from rooms if any
    if (project.rooms.length > 0) {
      const avgProgress = Math.round(
        project.rooms.reduce((acc, r) => acc + (r.progress || 0), 0) / project.rooms.length
      );
      project.progress = avgProgress;
    }

    await project.save();

    return sendSuccess(res, 200, 'Room updated successfully', room);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room from house project
// @route   DELETE /api/projects/:id/rooms/:roomId
// @access  Private
export const deleteRoom = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    project.rooms.pull({ _id: req.params.roomId });
    await project.save();

    return sendSuccess(res, 200, 'Room deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Client approves or requests revision for a room design
// @route   POST /api/projects/:id/rooms/:roomId/review
// @access  Private (CLIENT, ADMIN)
export const reviewRoomDesign = async (req, res, next) => {
  try {
    const { action, comments } = req.body; // action: 'APPROVE' | 'REQUEST_CHANGES'
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const room = project.rooms.id(req.params.roomId);
    if (!room) {
      return sendError(res, 404, 'Room not found');
    }

    if (action === 'APPROVE') {
      room.designStatus = 'Approved';
      room.clientFeedback = comments || 'Approved by client.';
      
      if (project.designer) {
        await Notification.create({
          recipient: project.designer,
          type: 'PROPOSAL_APPROVED',
          title: `Room Design Approved: ${room.name}`,
          message: `The client has approved the design concepts for "${room.name}" in project "${project.title}".`,
          relatedProject: project._id,
        });
      }
    } else if (action === 'REQUEST_CHANGES') {
      room.designStatus = 'Changes Requested';
      room.clientFeedback = comments || 'Changes requested by client.';
      
      const revisionNumber = (room.revisions?.length || 0) + 1;
      room.revisions.push({
        revisionNumber,
        requestedBy: req.user._id,
        comments: comments || 'Please adjust the spatial concepts.',
        date: new Date(),
        status: 'Pending',
      });

      if (project.designer) {
        await Notification.create({
          recipient: project.designer,
          type: 'REVISION_REQUESTED',
          title: `Revision Requested: ${room.name}`,
          message: `Client requested changes for "${room.name}" in "${project.title}": "${comments || 'See notes'}"`,
          relatedProject: project._id,
        });
      }
    } else {
      return sendError(res, 400, 'Invalid review action. Use APPROVE or REQUEST_CHANGES.');
    }

    await project.save();

    await logActivity({
      user: req.user,
      action: action === 'APPROVE' ? 'PROPOSAL_APPROVED' : 'REVISION_REQUESTED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Room "${room.name}" design ${action === 'APPROVE' ? 'approved' : 'revision requested'} by ${req.user.name}`,
    });

    return sendSuccess(res, 200, `Room design ${action === 'APPROVE' ? 'approved' : 'marked for changes'}`, room);
  } catch (error) {
    next(error);
  }
};

// @desc    Add photo to house project gallery
// @route   POST /api/projects/:id/photos
// @access  Private
export const addHousePhoto = async (req, res, next) => {
  try {
    const { url, caption, roomType, tag } = req.body;
    if (!url) {
      return sendError(res, 400, 'Photo URL is required');
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    project.housePhotos.push({
      url,
      caption: caption || '',
      roomType: roomType || 'Exterior',
      tag: tag || 'current',
      uploadedAt: new Date(),
    });

    await project.save();

    return sendSuccess(res, 201, 'Photo added to house gallery', project.housePhotos[project.housePhotos.length - 1]);
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

// @desc    Generate AI Design Proposal from room image and requirements
// @route   POST /api/projects/:id/rooms/:roomId/ai-proposal
// @access  Private
export const generateRoomAIProposal = async (req, res, next) => {
  try {
    const { imageUrl, style, budgetAmount, budgetTier, requirements } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return sendError(res, 404, 'Project not found');

    const room = project.rooms.id(req.params.roomId);
    if (!room) return sendError(res, 404, 'Room not found');

    const proposal = await analyzeRoomImageAndGenerateProposal({
      imageUrl: imageUrl || (room.photos?.[0]?.url || ''),
      spaceType: room.name,
      style: style || room.style || 'Modern',
      budgetAmount: budgetAmount || room.budget || 500000,
      budgetTier: budgetTier || 'Premium',
      requirements: requirements || project.requirements || '',
      dimensions: {
        length: room.length || 15,
        width: room.width || 12,
        height: room.height || 10,
      },
      lifestyle: project.designBrief || {},
    });

    room.aiProposal = proposal;
    await project.save();

    await logActivity({
      user: req.user,
      action: 'AI_DESIGN_GENERATED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Generated AI Design Proposal for space "${room.name}" (${style || 'Modern'})`,
    });

    return sendSuccess(res, 200, 'AI Design Proposal generated successfully', proposal);
  } catch (error) {
    next(error);
  }
};

// @desc    Convert AI Design recommendations into real project materials, furniture & tasks
// @route   POST /api/projects/:id/rooms/:roomId/convert-ai
// @access  Private (DESIGNER / ADMIN)
export const convertAIToProjectData = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const room = project.rooms.id(req.params.roomId);
    if (!room || !room.aiProposal) {
      return sendError(res, 400, 'No AI Proposal available for this room.');
    }

    const { furnitureRecommendations = [], materialRecommendations = [] } = room.aiProposal;

    // Convert furniture
    furnitureRecommendations.forEach((item) => {
      const exists = room.furniture.some((f) => f.name === item.name);
      if (!exists) {
        room.furniture.push({
          name: item.name,
          quantity: item.quantity || 1,
          estimatedCost: item.estimatedCost || 0,
          vendor: item.supplier || '',
          notes: `${item.material || ''} - ${item.finish || ''}`,
          status: 'Selected',
        });
      }
    });

    // Convert materials
    materialRecommendations.forEach((item) => {
      const exists = room.materials.some((m) => m.name === item.name);
      if (!exists) {
        room.materials.push({
          name: item.name,
          category: item.category || 'Other',
          price: item.estimatedPrice || 0,
          supplier: item.supplier || '',
          finish: item.finish || '',
          notes: item.notes || '',
          status: 'Specified',
        });
      }
    });

    // Generate execution tasks
    const suggestedTasks = [
      { title: `Wall Prep & Painting for ${room.name}`, category: 'Painting' },
      { title: `Electrical Points & Lighting for ${room.name}`, category: 'Electrical' },
      { title: `Flooring & Tiling Installation for ${room.name}`, category: 'Flooring' },
      { title: `Furniture Fit-out & Assembly for ${room.name}`, category: 'Carpentry' },
      { title: `Final Cleaning & Snagging for ${room.name}`, category: 'Finishing' },
    ];

    for (const t of suggestedTasks) {
      await Task.create({
        title: t.title,
        description: `Turnkey execution task generated from approved specifications for ${room.name}`,
        project: project._id,
        category: t.category,
        assignedBy: req.user._id,
        assignedTo: project.contractor || req.user._id,
        priority: 'MEDIUM',
        status: 'TODO',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    }

    await project.save();

    await logActivity({
      user: req.user,
      action: 'AI_PROPOSAL_CONVERTED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Converted AI recommendations into project materials, furniture & tasks for "${room.name}"`,
    });

    return sendSuccess(res, 200, 'AI recommendations successfully converted into project data', room);
  } catch (error) {
    next(error);
  }
};

// @desc    Add Quotation to project
// @route   POST /api/projects/:id/quotations
// @access  Private (DESIGNER / ADMIN)
export const createQuotation = async (req, res, next) => {
  try {
    const { title, items = [] } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const formattedItems = items.map((item) => {
      const lineSubtotal = (item.quantity || 1) * (item.unitPrice || 0);
      const lineDiscount = item.discount || 0;
      const lineTaxable = Math.max(0, lineSubtotal - lineDiscount);
      const lineTax = (lineTaxable * (item.taxPercent || 18)) / 100;
      const lineTotal = lineTaxable + lineTax;

      subtotal += lineSubtotal;
      discountTotal += lineDiscount;
      taxTotal += lineTax;

      return {
        category: item.category || 'Civil & Interior',
        description: item.description,
        quantity: item.quantity || 1,
        unit: item.unit || 'Lump Sum',
        unitPrice: item.unitPrice || 0,
        discount: lineDiscount,
        taxPercent: item.taxPercent || 18,
        total: lineTotal,
      };
    });

    const quoteNumber = `QT-${Date.now().toString().slice(-6)}`;
    const newQuote = {
      quoteNumber,
      title: title || `Fit-out Quotation ${quoteNumber}`,
      status: 'Submitted',
      items: formattedItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal: subtotal - discountTotal + taxTotal,
    };

    project.quotations.push(newQuote);
    await project.save();

    return sendSuccess(res, 201, 'Quotation created successfully', project.quotations[project.quotations.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or request changes for quotation
// @route   POST /api/projects/:id/quotations/:quoteId/review
// @access  Private (CLIENT / ADMIN)
export const reviewQuotation = async (req, res, next) => {
  try {
    const { status, clientNotes } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const quote = project.quotations.id(req.params.quoteId);
    if (!quote) return sendError(res, 404, 'Quotation not found');

    quote.status = status === 'Approved' ? 'Approved' : 'Changes Requested';
    quote.clientNotes = clientNotes || '';
    if (status === 'Approved') {
      quote.approvedAt = new Date();
      quote.approvedBy = req.user._id;
    }

    await project.save();
    return sendSuccess(res, 200, `Quotation ${quote.status}`, quote);
  } catch (error) {
    next(error);
  }
};

// @desc    Record universal approval decision
// @route   POST /api/projects/:id/approvals
// @access  Private
export const recordApprovalDecision = async (req, res, next) => {
  try {
    const { type, entityId, entityTitle, status, version, comment } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const approval = {
      type,
      entityId: entityId || '',
      entityTitle: entityTitle || `${type} Item`,
      requestedBy: req.user._id,
      reviewer: req.user._id,
      status: status || 'Approved',
      version: version || 1,
      comment: comment || '',
      decisionDate: new Date(),
    };

    project.approvals.push(approval);
    await project.save();

    return sendSuccess(res, 201, 'Approval decision logged', approval);
  } catch (error) {
    next(error);
  }
};

// @desc    Add Site Survey / Visit Log
// @route   POST /api/projects/:id/site-visits
// @access  Private (CONTRACTOR / DESIGNER / ADMIN)
export const addSiteVisit = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const visit = {
      visitDate: req.body.visitDate || new Date(),
      inspector: req.user._id,
      measurements: req.body.measurements || '',
      existingCondition: req.body.existingCondition || '',
      electricalCondition: req.body.electricalCondition || 'Standard points verified',
      plumbingCondition: req.body.plumbingCondition || 'Inlet/outlet positions confirmed',
      wallCondition: req.body.wallCondition || 'Good structural plaster',
      floorCondition: req.body.floorCondition || 'Levelled floor screed',
      ceilingCondition: req.body.ceilingCondition || 'Clear ceiling height verified',
      constraints: req.body.constraints || '',
      notes: req.body.notes || '',
      photos: req.body.photos || [],
    };

    project.siteVisits.push(visit);
    await project.save();

    return sendSuccess(res, 201, 'Site visit recorded successfully', project.siteVisits[project.siteVisits.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Add Issue ticket
// @route   POST /api/projects/:id/issues
// @access  Private
export const addProjectIssue = async (req, res, next) => {
  try {
    const { title, description, room, priority, photos } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const issue = {
      title,
      description: description || '',
      room: room || 'General',
      priority: priority || 'Medium',
      createdBy: req.user._id,
      photos: photos || [],
      status: 'Open',
      createdAt: new Date(),
    };

    project.issues.push(issue);
    await project.save();

    return sendSuccess(res, 201, 'Issue reported successfully', project.issues[project.issues.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Issue status / resolution
// @route   PATCH /api/projects/:id/issues/:issueId
// @access  Private
export const updateProjectIssue = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const issue = project.issues.id(req.params.issueId);
    if (!issue) return sendError(res, 404, 'Issue not found');

    if (status) issue.status = status;
    if (resolution) issue.resolution = resolution;
    if (status === 'Resolved' || status === 'Closed') {
      issue.resolvedAt = new Date();
    }

    await project.save();
    return sendSuccess(res, 200, 'Issue updated successfully', issue);
  } catch (error) {
    next(error);
  }
};

// @desc    Add Snag / Punch List item
// @route   POST /api/projects/:id/snags
// @access  Private
export const addProjectSnag = async (req, res, next) => {
  try {
    const { description, room, priority, dueDate, photo } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const snag = {
      description,
      room: room || 'General',
      priority: priority || 'Medium',
      assignedTo: project.contractor || req.user._id,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Open',
      photo: photo || '',
    };

    project.snags.push(snag);
    await project.save();

    return sendSuccess(res, 201, 'Snag item logged successfully', project.snags[project.snags.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Snag status
// @route   PATCH /api/projects/:id/snags/:snagId
// @access  Private
export const updateProjectSnag = async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const snag = project.snags.id(req.params.snagId);
    if (!snag) return sendError(res, 404, 'Snag not found');

    if (status) snag.status = status;
    if (status === 'Completed' || status === 'Resolved') snag.verifiedAt = new Date();

    await project.save();
    return sendSuccess(res, 200, 'Snag status updated', snag);
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update procurement item
// @route   POST /api/projects/:id/procurement
// @access  Private
export const addProcurementItem = async (req, res, next) => {
  try {
    const { itemName, category, room, supplier, quantityRequired, unitCost } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const item = {
      itemName,
      category: category || 'Materials',
      room: room || 'General',
      supplier: supplier || '',
      quantityRequired: quantityRequired || '1',
      unitCost: unitCost || 0,
      totalCost: (parseFloat(quantityRequired) || 1) * (unitCost || 0),
      status: 'Required',
      orderDate: new Date(),
    };

    project.procurement.push(item);
    await project.save();

    return sendSuccess(res, 201, 'Procurement item added', project.procurement[project.procurement.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Final Handover Completion
// @route   POST /api/projects/:id/handover
// @access  Private (CLIENT / ADMIN)
export const completeProjectHandover = async (req, res, next) => {
  try {
    const { inspectionNotes, clientSignoffNotes } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    project.handoverDetails = {
      isHandoverCompleted: true,
      handoverDate: new Date(),
      approvedByClient: true,
      finalInspectionDate: new Date(),
      inspectionNotes: inspectionNotes || 'All quality checks and room finishes inspected and verified.',
      clientSignoffNotes: clientSignoffNotes || 'Handover completed satisfactorily.',
    };

    project.status = 'COMPLETED';
    project.progress = 100;
    project.rooms.forEach((r) => {
      r.executionStatus = 'Completed';
      r.progress = 100;
    });

    await project.save();

    await logActivity({
      user: req.user,
      action: 'PROJECT_HANDOVER_COMPLETED',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Project "${project.title}" officially handed over and marked COMPLETED`,
    });

    return sendSuccess(res, 200, 'Project successfully handed over and completed!', project);
  } catch (error) {
    next(error);
  }
};

// @desc    Add Moodboard Image / Texture to room
// @route   POST /api/projects/:id/rooms/:roomId/moodboard
// @access  Private
export const addRoomMoodboardItem = async (req, res, next) => {
  try {
    const { imageUrl, title, tags, notes } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found');

    const room = project.rooms.id(req.params.roomId);
    if (!room) return sendError(res, 404, 'Room not found');

    const item = {
      imageUrl,
      title: title || 'Concept Reference',
      tags: tags || ['Inspiration'],
      notes: notes || '',
      addedBy: req.user._id,
      likes: 0,
      createdAt: new Date(),
    };

    room.moodboard.push(item);
    await project.save();

    return sendSuccess(res, 201, 'Moodboard item added', item);
  } catch (error) {
    next(error);
  }
};

