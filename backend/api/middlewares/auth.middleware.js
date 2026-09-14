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
 * req.user بيبقى فيه: { id, role }
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير مصرح، سجل دخول أولاً' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
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

/**
 * requireSelfOrAdmin Middleware
 * بيسمح للمستخدم يوصل لبياناته هو بس، أو للأدمن يوصل لأي مستخدم
 *
 * الاستخدام:
 *   router.get('/:id', requireAuth, requireSelfOrAdmin, controllerFunction);
 *
 * بيعتمد على إن requireAuth حط { id, role } في req.user
 * وإن الـ route فيه param اسمه id
 */
function requireSelfOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'غير مصرح، سجل دخول أولاً' });
  }
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'مش مسموح لك بالوصول ده' });
}

module.exports = { requireAuth, requireRole, requireSelfOrAdmin };
