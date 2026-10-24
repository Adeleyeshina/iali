import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Helper to extract JWT token from authorization header or cookie
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

// Verify JWT token from Authorization header or cookie
export const verifyToken = (req, res, next) => {
  const token = extractToken(req);

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

// Optional token extraction for public routes with authenticated enhancements
export const optionalAuth = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  return next();
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
