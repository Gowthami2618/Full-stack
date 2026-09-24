import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all users with search, filtering, and pagination
// @route   GET /api/users
// @access  Private (ADMIN)
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by role
    if (req.query.role && req.query.role !== 'ALL') {
      query.role = req.query.role;
    }

    // Filter by verification status
    if (req.query.isVerified !== undefined && req.query.isVerified !== 'ALL') {
      query.isVerified = req.query.isVerified === 'true';
    }

    // Filter by active status
    if (req.query.isActive !== undefined && req.query.isActive !== 'ALL') {
      query.isActive = req.query.isActive === 'true';
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendSuccess(
      res,
      200,
      'Users retrieved successfully',
      users,
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

// @desc    Get public directory of designers and contractors
// @route   GET /api/users/professionals
// @access  Private
export const getProfessionals = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = { isActive: true };

    if (role && ['DESIGNER', 'CONTRACTOR'].includes(role.toUpperCase())) {
      query.role = role.toUpperCase();
    } else {
      query.role = { $in: ['DESIGNER', 'CONTRACTOR'] };
    }

    const professionals = await User.find(query)
      .select('name email phone role profileImage bio location isVerified createdAt')
      .sort({ isVerified: -1, name: 1 });

    return sendSuccess(res, 200, 'Professionals list retrieved', professionals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (activate / deactivate)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private (ADMIN)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (user.role === 'ADMIN' && user._id.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'Admin cannot deactivate their own account.');
    }

    user.isActive = !user.isActive;
    await user.save();

    await logActivity({
      user: req.user,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'USER',
      entityId: user._id,
      description: `Admin ${req.user.name} ${user.isActive ? 'activated' : 'deactivated'} user ${user.name} (${user.email})`,
    });

    return sendSuccess(res, 200, `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify designer or contractor
// @route   PATCH /api/users/:id/verify
// @access  Private (ADMIN)
export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    user.isVerified = true;
    await user.save();

    // Create notification for verified professional
    await Notification.create({
      recipient: user._id,
      type: 'USER_VERIFIED',
      title: 'Profile Verified',
      message: 'Congratulations! Your professional profile on DesignSpace has been officially verified by the platform admin.',
    });

    await logActivity({
      user: req.user,
      action: 'USER_VERIFIED',
      entityType: 'USER',
      entityId: user._id,
      description: `Admin ${req.user.name} verified professional credentials for ${user.name} (${user.role})`,
    });

    return sendSuccess(res, 200, `${user.role} verified successfully`, user);
  } catch (error) {
    next(error);
  }
};
