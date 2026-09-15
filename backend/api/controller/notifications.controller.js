const notificationService = require('../services/notification.service');

// All routes here require requireAuth — a user only sees their own notifications.

/**
 * GET /api/notifications
 * All notifications of the current user, newest first.
 */
async function getMyNotifications(req, res, next) {
  try {
    const data = await notificationService.getUserNotifications(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/:id/read
 */
async function markNotificationAsRead(req, res, next) {
  try {
    const data = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ success: false, message: 'Notification not found' });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/read-all
 */
async function markAllNotificationsAsRead(req, res, next) {
  try {
   await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
