import AuditLog from '../models/AuditLog.js';
import { sendSuccess } from '../utils/apiResponse.js';

// @desc    Get system audit logs
// @route   GET /api/audit-logs
// @access  Private (ADMIN)
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.entityType && req.query.entityType !== 'ALL') {
      query.entityType = req.query.entityType;
    }

    if (req.query.action) {
      query.action = { $regex: req.query.action, $options: 'i' };
    }

    if (req.query.search) {
      query.description = { $regex: req.query.search, $options: 'i' };
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('user', 'name email role profileImage')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    return sendSuccess(res, 200, 'Audit logs retrieved', logs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
