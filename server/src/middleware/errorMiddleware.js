import { sendError } from '../utils/apiResponse.js';

// Catch 404 for undefined routes
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with ID of ${err.value}`;
  }

  // Handle Mongoose Duplicate Key (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for '${field}'. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(', ');
  }

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size limit exceeded. Maximum file size allowed is 10MB.';
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  return sendError(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'production' ? null : (errors || err.stack)
  );
};
