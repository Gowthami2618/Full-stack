export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, pagination = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(pagination !== null && { pagination }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
  };
  return res.status(statusCode).json(response);
};
