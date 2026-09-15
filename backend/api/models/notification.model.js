const mongoose = require('mongoose');

/**
 * Notification Model
 *
 * Notifications are created automatically when:
 *   - a booking is confirmed → type: 'booking',   title: 'Booking Confirmed'
 *   - a booking is completed → type: 'booking',   title: 'Booking Completed'
 *   - a booking is cancelled → type: 'cancelled', title: 'Booking Cancelled'
 *
 * isRead flips to true once the user sees the notification.
 *
 * Note: notifications are created via the notification service,
 * never directly from a controller.
 */
const notificationSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    type:      {
      type: String,
      enum: ['booking', 'cancelled', 'reminder'],
      default: 'booking',
    },
    isRead:    { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
