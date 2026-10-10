const jwt = require('jsonwebtoken');
const JWT = () => process.env.JWT_SECRET || 'change-me-dev-secret';
function authRequired(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'login required' });
  try { req.user = jwt.verify(token, JWT()); next(); }
  catch { return res.status(401).json({ error: 'bad token' }); }
}
function roleRequired(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'wrong role' });
    next();
  };
}
module.exports = { authRequired, roleRequired };
