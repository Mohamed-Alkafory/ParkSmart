const Notification = require('../models/notification.model');

/**
 * Notification Service
 *
 * The helper other services call when they need to notify a user.
 * It is not meant to be called directly from controllers.
 *
 * Usage in bookings.service.js:
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
 *
 * @param {{ userId, bookingId, title, message, type }} data
 * @returns {Promise<Object>}
 */
async function createNotification(data) {
  return await Notification.create(data);
}

/**
 * getUserNotifications
 * All notifications of a user, newest first.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getUserNotifications(userId) {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
}

/**
 * markAsRead
 * Marks a notification as read (isRead: true).
 * Scoped to the user's own notification.
 *
 * @param {string} notificationId
 * @param {string} userId
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
 * Marks all of a user's notifications as read in one batch.
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
