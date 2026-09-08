const express = require('express');
const router  = express.Router();
const { register, login } = require('../controller/auth.controller');

/**
 * Auth Routes
 * Base: /api/auth
 *
 * POST /api/auth/register  → تسجيل مستخدم جديد
 * POST /api/auth/login     → تسجيل الدخول والحصول على JWT token
 *
 * TODO: ممكن تضيف:
 *   - POST /api/auth/logout  (لو هتعمل token blacklist)
 *   - GET  /api/auth/me      → جلب بيانات المستخدم الحالي
 *   - POST /api/auth/refresh → تجديد الـ token
 */

router.post('/register', register);
router.post('/login',    login);

module.exports = router;
