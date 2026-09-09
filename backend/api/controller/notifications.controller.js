const notificationService = require('../services/notification.service');

/**
 * Notifications Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 *
 * ⚠️ كل الـ routes هنا تحتاج requireAuth — الـ user يشوف إشعاراته بس
 */

/**
 * GET /api/notifications
 * جلب كل إشعارات المستخدم الحالي — مرتبة من الأحدث
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
 * علّم إشعار معين كـ مقروء
 */
async function markNotificationAsRead(req, res, next) {
  try {
    const data = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ success: false, message: 'الإشعار غير موجود' });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/read-all
 * علّم كل إشعارات المستخدم كـ مقروءة دفعة واحدة
 */
async function markAllNotificationsAsRead(req, res, next) {
  try {
   await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'تم تحديد كل الإشعارات كمقروءة' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
