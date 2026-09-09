const Notification = require('../models/notification.model');

/**
 * Notification Service — منطق الإشعارات
 *
 * ده الـ service اللي بيتبعته كل service تانية عايزة تبعت إشعار
 * مش المفروض يتستدعى مباشرة من الـ controller
 *
 * الاستخدام في bookings.service.js مثلاً:
 *   const notificationService = require('./notification.service');
 *   await notificationService.createNotification({
 *     userId,
 *     bookingId,
 *     title: 'Booking Confirmed',
 *     message: 'Your parking booking has been confirmed successfully.',
 *     type: 'booking',
 *   });
 */

/**
 * createNotification
 * بيحفظ إشعار جديد في الـ DB
 *
 * TODO: اعمل الـ function دي:
 *   - ساف الـ notification في الـ DB
 *   - TODO الاختياري: لو في Push Notifications (FCM مثلاً) ابعتها هنا
 *
 * @param {{ userId, bookingId, title, message, type }} data
 * @returns {Promise<Object>} الإشعار الجديد
 */
async function createNotification(data) {
  // TODO: implement
  return await Notification.create(data);
}

/**
 * getUserNotifications
 * بيجيب كل إشعارات مستخدم معين مرتبة من الأحدث
 *
 * TODO:
 *   - اجلب الـ notifications مع sort -createdAt
 *   - ممكن تضيف pagination هنا لو الـ notifications اتكترت
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getUserNotifications(userId) {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
}

/**
 * markAsRead
 * بيعلم الإشعار كـ مقروء (isRead: true)
 *
 * TODO:
 *   - تحقق إن الـ notification بتاعة الـ user ده (أمان)
 *   - عدّل isRead لـ true
 *
 * @param {string} notificationId
 * @param {string} userId - عشان نتحقق إن الإشعار ده بتاعه هو
 * @returns {Promise<Object>}
 */
async function markAsRead(notificationId, userId) {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
}

/**
 * markAllAsRead
 * بيعلم كل إشعارات المستخدم كـ مقروءة دفعة واحدة
 *
 * TODO:
 *   - عدّل كل الـ notifications اللي userId = userId و isRead = false
 *
 * @param {string} userId
 * @returns {Promise<Object>} result
 */
async function markAllAsRead(userId) {
  return await Notification.updateMany(
    {
      userId: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
