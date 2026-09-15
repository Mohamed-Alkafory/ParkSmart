const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.config');

/**
 * requireAuth
 * Verifies a valid token in the Authorization header.
 * On success, attaches the user payload to req.user and continues.
 *
 * Usage in routes:
 *   router.post('/', requireAuth, controllerFunction);
 *
 * req.user contains: { id, role }
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized, please log in first' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * requireRole
 * Verifies the user has one of the roles required to access the route.
 *
 * Usage:
 *   router.post('/', requireAuth, requireRole('owner'), controllerFunction);
 *   router.get('/admin', requireAuth, requireRole('admin'), controllerFunction);
 *
 * @param {...string} roles - allowed roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You are not allowed to access this resource' });
    }
    next();
  };
}

/**
 * requireSelfOrAdmin
 * Allows a user to access only their own data, or an admin to access any user.
 *
 * Usage:
 *   router.get('/:id', requireAuth, requireSelfOrAdmin, controllerFunction);
 *
 * Relies on requireAuth having set { id, role } on req.user,
 * and on the route having a param named id.
 */
function requireSelfOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized, please log in first' });
  }
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'You are not allowed to access this resource' });
}

module.exports = { requireAuth, requireRole, requireSelfOrAdmin };
