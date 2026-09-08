const authService = require('../services/auth.service');

/**
 * Auth Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 * مش المفروض يبقى فيه أي منطق أو DB queries هنا
 */

/**
 * POST /api/auth/register
 * تسجيل مستخدم جديد
 * Body: { name, email, password, role?, phone? }
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role, phone } = req.body;

    // TODO: ممكن تضيف validation هنا أو تستخدم middleware validation (زي express-validator)
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل كل البيانات المطلوبة' });
    }

    const data = await authService.registerUser({ name, email, password, role, phone });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err); // بيتبعته لـ errorHandler middleware
  }
}

/**
 * POST /api/auth/login
 * تسجيل الدخول
 * Body: { email, password }
 * Response: { token, user }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'أدخل الإيميل والباسورد' });
    }

    const data = await authService.loginUser({ email, password });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
