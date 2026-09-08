const express = require('express');
const router  = express.Router();
const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require('../controller/notifications.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * Notifications Routes
 * Base: /api/notifications
 *
 * ⚠️ كل الـ routes هنا تحتاج requireAuth — مفيش إشعارات عامة
 *
 * GET   /api/notifications           → كل إشعاراتي
 * PATCH /api/notifications/read-all  → علّم الكل كمقروء
 * PATCH /api/notifications/:id/read  → علّم إشعار كمقروء
 *
 * ⚠️ ترتيب الـ routes مهم — /read-all لازم قبل /:id/read
 *   عشان Express ميعملش confusion بين /read-all و /:id
 */

router.get('/',                 requireAuth, getMyNotifications);
router.patch('/read-all',       requireAuth, markAllNotificationsAsRead);
router.patch('/:id/read',       requireAuth, markNotificationAsRead);

module.exports = router;
