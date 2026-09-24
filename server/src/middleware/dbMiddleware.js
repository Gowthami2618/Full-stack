import mongoose from 'mongoose';
import { sendError } from '../utils/apiResponse.js';

export const checkDbConnection = (req, res, next) => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return sendError(
      res,
      503,
      'Database not connected. Please check your MongoDB Atlas URI in server/.env and verify network access / IP whitelist.'
    );
  }
  next();
};
