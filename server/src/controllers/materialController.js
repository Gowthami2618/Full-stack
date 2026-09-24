import Material from '../models/Material.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all materials for a project
// @route   GET /api/materials
// @access  Private
export const getMaterials = async (req, res, next) => {
  try {
    const { projectId, category, status } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (category && category !== 'ALL') query.category = category;
    if (status && status !== 'ALL') query.status = status;

    const materials = await Material.find(query).sort({ category: 1, name: 1 });
    return sendSuccess(res, 200, 'Materials retrieved successfully', materials);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new material entry
// @route   POST /api/materials
// @access  Private
export const createMaterial = async (req, res, next) => {
  try {
    const {
      projectId,
      name,
      category,
      supplier,
      quantity,
      unit,
      estimatedCost,
      actualCost,
      status,
      notes,
    } = req.body;

    if (!projectId || !name || !category) {
      return sendError(res, 400, 'Project ID, material name, and category are required.');
    }

    const material = await Material.create({
      project: projectId,
      name,
      category,
      supplier: supplier || '',
      quantity: Number(quantity) || 1,
      unit: unit || 'units',
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      status: status || 'PLANNED',
      notes: notes || '',
    });

    await logActivity({
      user: req.user,
      action: 'MATERIAL_ADDED',
      entityType: 'MATERIAL',
      entityId: material._id,
      description: `Material "${material.name}" (${material.category}) added to project`,
    });

    return sendSuccess(res, 201, 'Material added successfully', material);
  } catch (error) {
    next(error);
  }
};

// @desc    Update material details or status
// @route   PUT /api/materials/:id
// @access  Private
export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return sendError(res, 404, 'Material not found');
    }

    const oldStatus = material.status;
    const updated = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.status && req.body.status !== oldStatus) {
      const project = await Project.findById(material.project);
      if (project && project.client) {
        await Notification.create({
          recipient: project.client,
          type: 'MATERIAL_STATUS_CHANGED',
          title: 'Material Status Updated',
          message: `Material "${updated.name}" status changed to ${updated.status}.`,
          relatedProject: project._id,
        });
      }
    }

    await logActivity({
      user: req.user,
      action: 'MATERIAL_UPDATED',
      entityType: 'MATERIAL',
      entityId: updated._id,
      description: `Material "${updated.name}" updated by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Material updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return sendError(res, 404, 'Material not found');
    }

    await Material.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.user,
      action: 'MATERIAL_DELETED',
      entityType: 'MATERIAL',
      entityId: req.params.id,
      description: `Material "${material.name}" removed by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Material removed successfully');
  } catch (error) {
    next(error);
  }
};
