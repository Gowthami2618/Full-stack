import fs from 'fs';
import path from 'path';
import File from '../models/File.js';
import Project from '../models/Project.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get files for a project
// @route   GET /api/files
// @access  Private
export const getFiles = async (req, res, next) => {
  try {
    const { projectId, fileType } = req.query;
    if (!projectId) {
      return sendError(res, 400, 'Project ID is required.');
    }

    const query = { project: projectId };
    if (fileType && fileType !== 'ALL') query.fileType = fileType;

    const files = await File.find(query)
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Files retrieved successfully', files);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file for a project
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please upload a file.');
    }

    const { projectId, name, fileType } = req.body;
    if (!projectId) {
      return sendError(res, 400, 'Project ID is required.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const filePath = `/uploads/${req.file.filename}`;

    const newFile = await File.create({
      project: projectId,
      uploadedBy: req.user._id,
      name: name || req.file.originalname,
      originalName: req.file.originalname,
      filePath,
      fileType: fileType || 'Document',
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    // If it's a design or room image, optionally push into project images array
    if (['Room Image', 'Design Image'].includes(fileType)) {
      project.images.push(filePath);
      await project.save();
    }

    await logActivity({
      user: req.user,
      action: 'FILE_UPLOADED',
      entityType: 'FILE',
      entityId: newFile._id,
      description: `File "${newFile.name}" (${newFile.fileType}) uploaded to project "${project.title}"`,
    });

    const populatedFile = await File.findById(newFile._id).populate(
      'uploadedBy',
      'name email role'
    );

    return sendSuccess(res, 201, 'File uploaded successfully', populatedFile);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return sendError(res, 404, 'File not found');
    }

    // Try to remove physical file from disk
    const diskPath = path.join(process.cwd(), file.filePath);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.warn(`Could not delete file from disk: ${diskPath}`);
      }
    }

    await File.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.user,
      action: 'FILE_DELETED',
      entityType: 'FILE',
      entityId: req.params.id,
      description: `File "${file.name}" deleted by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'File deleted successfully');
  } catch (error) {
    next(error);
  }
};
