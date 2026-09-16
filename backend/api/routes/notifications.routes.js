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
 * All routes here require requireAuth — there are no public notifications.
 *
 * GET   /api/notifications           → current user's notifications
 * PATCH /api/notifications/read-all  → mark all as read
 * PATCH /api/notifications/:id/read  → mark one notification as read
 *
 * Route order matters — /read-all must come before /:id/read
 * so Express does not confuse /read-all with /:id.
 */

router.get('/',                 requireAuth, getMyNotifications);
router.patch('/read-all',       requireAuth, markAllNotificationsAsRead);
router.patch('/:id/read',       requireAuth, markNotificationAsRead);

module.exports = router;
