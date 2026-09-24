import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get tasks for a project or assigned user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (status && status !== 'ALL') query.status = status;
    if (priority && priority !== 'ALL') query.priority = priority;

    if (assignedTo) {
      query.assignedTo = assignedTo;
    } else if (req.user.role === 'CONTRACTOR' && !projectId) {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email role profileImage')
      .populate('assignedBy', 'name email role')
      .populate('project', 'title status')
      .populate('comments.user', 'name email role profileImage')
      .sort({ dueDate: 1, priority: -1 });

    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const {
      projectId,
      title,
      description,
      assignedTo,
      priority,
      status,
      dueDate,
      attachments,
    } = req.body;

    if (!projectId || !title) {
      return sendError(res, 400, 'Project ID and title are required.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const task = await Task.create({
      project: projectId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
      priority: priority || 'MEDIUM',
      status: status || 'TODO',
      dueDate: dueDate || null,
      attachments: attachments || [],
    });

    // If assigned to a user, send notification
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}" on project "${project.title}".`,
        relatedProject: project._id,
      });
    }

    await logActivity({
      user: req.user,
      action: 'TASK_CREATED',
      entityType: 'TASK',
      entityId: task._id,
      description: `Task "${task.title}" created in project "${project.title}"`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role profileImage')
      .populate('assignedBy', 'name email role');

    return sendSuccess(res, 201, 'Task created successfully', populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    const wasCompleted = task.status === 'COMPLETED';
    const newStatus = req.body.status;

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'name email role profileImage')
      .populate('assignedBy', 'name email role')
      .populate('comments.user', 'name email role profileImage');

    // If task marked as completed
    if (newStatus === 'COMPLETED' && !wasCompleted) {
      await Notification.create({
        recipient: task.assignedBy._id,
        type: 'TASK_COMPLETED',
        title: 'Task Completed',
        message: `Task "${task.title}" has been marked completed by ${req.user.name}.`,
        relatedProject: task.project._id,
      });

      await logActivity({
        user: req.user,
        action: 'TASK_COMPLETED',
        entityType: 'TASK',
        entityId: task._id,
        description: `Task "${task.title}" completed by ${req.user.name}`,
      });
    }

    return sendSuccess(res, 200, 'Task updated successfully', task);
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addTaskComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return sendError(res, 400, 'Comment text is required.');
    }

    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    task.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await task.save();

    // If assignedTo exists and isn't the commenter, notify them
    if (
      task.assignedTo &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: task.assignedTo,
        type: 'TASK_COMMENT',
        title: 'New Comment on Task',
        message: `${req.user.name} commented on task "${task.title}": "${text.substring(0, 50)}..."`,
        relatedProject: task.project._id,
      });
    }

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role profileImage')
      .populate('assignedBy', 'name email role')
      .populate('comments.user', 'name email role profileImage');

    return sendSuccess(res, 201, 'Comment added successfully', updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    await Task.findByIdAndDelete(req.params.id);

    await logActivity({
      user: req.user,
      action: 'TASK_DELETED',
      entityType: 'TASK',
      entityId: req.params.id,
      description: `Task "${task.title}" deleted by ${req.user.name}`,
    });

    return sendSuccess(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
