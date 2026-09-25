import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

// Authenticate user via JWT in HTTP-only cookie or Authorization Bearer header
export const authenticate = async (req, res, next) => {
  let token;

  // 1. Check Bearer Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const candidate = req.headers.authorization.split(' ')[1];
    if (candidate && candidate !== 'null' && candidate !== 'undefined') {
      token = candidate;
    }
  }

  // 2. Fallback to HTTP-only cookie if header not provided
  if (!token && req.cookies && req.cookies.jwt) {
    const cookieToken = req.cookies.jwt;
    if (cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined') {
      token = cookieToken;
    }
  }

  if (!token) {
    return sendError(
      res,
      401,
      'Authentication required. No access token provided.'
    );
  }

  try {
    const secret = process.env.JWT_SECRET || 'designspace_super_secure_jwt_secret_key_2026_dev_prod';
    const decoded = jwt.verify(token, secret);

    // Fetch user from DB to ensure account is still active and valid
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return sendError(res, 401, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return sendError(
        res,
        403,
        'Your account has been deactivated. Please contact support/admin.'
      );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // If header token verification failed, try cookie token as fallback if available
    if (
      req.cookies?.jwt &&
      token !== req.cookies.jwt &&
      req.cookies.jwt !== 'null' &&
      req.cookies.jwt !== 'undefined'
    ) {
      try {
        const secret = process.env.JWT_SECRET || 'designspace_super_secure_jwt_secret_key_2026_dev_prod';
        const decodedCookie = jwt.verify(req.cookies.jwt, secret);
        const cookieUser = await User.findById(decodedCookie.userId).select('-password');
        if (cookieUser && cookieUser.isActive) {
          req.user = cookieUser;
          return next();
        }
      } catch (_) {}
    }

    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Session expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid authentication token.');
    }
    return sendError(res, 401, 'Not authorized. Token verification failed.');
  }
};

// Role-Based Authorization Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required before checking permissions.');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not authorized to perform this action. Required: [${roles.join(', ')}]`
      );
    }

    next();
  };
};
