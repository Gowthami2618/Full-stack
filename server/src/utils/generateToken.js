import jwt from 'jsonwebtoken';

export const generateToken = (res, user) => {
  const secret = process.env.JWT_SECRET || 'designspace_super_secure_jwt_secret_key_2026_dev_prod';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  // Minimal secure payload
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  );

  // Set HTTP-only cookie
  if (res) {
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      Boolean(process.env.RENDER) ||
      Boolean(process.env.VERCEL);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction, // HTTPS in production
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  return token;
};

export const clearTokenCookie = (res) => {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RENDER) ||
    Boolean(process.env.VERCEL);

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
};
