import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Verify JWT token from Authorization header or cookie
export const verifyToken = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Log in first to continue',
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid. Please log in again.',
      message: 'Invalid or expired token.',
    });
  }
};

// Restrict route access to specified user roles
export const roleRequired = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: `Forbidden: requires ${allowedRoles.join(' or ')} access`,
      message: 'Forbidden. Insufficient permissions.',
    });
  }
  return next();
};
