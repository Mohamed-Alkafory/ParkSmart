const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.config');

/**
 * requireAuth Middleware
 * بيتحقق إن في token صالح في الـ Authorization header
 * لو صح، بيحط بيانات المستخدم في req.user ويكمل
 *
 * الاستخدام في الـ routes:
 *   router.post('/', requireAuth, controllerFunction);
 *
 * req.user بيبقى فيه: { userId, role }
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير مصرح، سجل دخول أولاً' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token غير صالح أو منتهي الصلاحية' });
  }
}

/**
 * requireRole Middleware
 * بيتحقق إن المستخدم عنده الـ role المطلوب للوصول للـ route
 *
 * الاستخدام:
 *   router.post('/', requireAuth, requireRole('owner'), controllerFunction);
 *   router.get('/admin', requireAuth, requireRole('admin'), controllerFunction);
 *
 * @param {...string} roles - الـ roles المسموح لها
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'مش مسموح لك بالوصول ده' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
