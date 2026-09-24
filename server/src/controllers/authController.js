import User from '../models/User.js';
import { generateToken, clearTokenCookie } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Register a new user (CLIENT, DESIGNER, CONTRACTOR)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return sendError(res, 400, 'Please fill in all required fields.');
    }

    if (password !== confirmPassword) {
      return sendError(res, 400, 'Passwords do not match.');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long.');
    }

    // Role verification (ADMIN cannot be publicly registered)
    const allowedRoles = ['CLIENT', 'DESIGNER', 'CONTRACTOR'];
    const assignedRole = role && allowedRoles.includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'CLIENT';

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return sendError(res, 400, 'An account with this email already exists.');
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: assignedRole,
      isVerified: assignedRole === 'CLIENT', // Designers and Contractors undergo verification
    });

    // Generate JWT and set secure cookie
    const token = generateToken(res, user);

    // Audit log
    await logActivity({
      user,
      action: 'USER_REGISTERED',
      entityType: 'AUTH',
      entityId: user._id,
      description: `New user registered as ${assignedRole}: ${user.name} (${user.email})`,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 201, 'Registration successful', {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password.');
    }

    // Check for user (explicitly include password)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Check if account is active
    if (!user.isActive) {
      return sendError(
        res,
        403,
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Generate token
    const token = generateToken(res, user);

    // Audit log
    await logActivity({
      user,
      action: 'USER_LOGIN',
      entityType: 'AUTH',
      entityId: user._id,
      description: `User logged in: ${user.name} (${user.role})`,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 200, 'Login successful', {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user session
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    return sendSuccess(res, 200, 'Current user retrieved', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);

    if (req.user) {
      await logActivity({
        user: req.user,
        action: 'USER_LOGOUT',
        entityType: 'AUTH',
        entityId: req.user._id,
        description: `User logged out: ${req.user.name}`,
      });
    }

    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, location, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();

    await logActivity({
      user: updatedUser,
      action: 'PROFILE_UPDATED',
      entityType: 'USER',
      entityId: updatedUser._id,
      description: `User profile updated for ${updatedUser.name}`,
    });

    return sendSuccess(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return sendError(res, 400, 'Please provide current and new password.');
    }

    if (newPassword !== confirmPassword) {
      return sendError(res, 400, 'New passwords do not match.');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters.');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return sendError(res, 400, 'Incorrect current password.');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};
