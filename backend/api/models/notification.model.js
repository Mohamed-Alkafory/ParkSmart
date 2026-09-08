const mongoose = require('mongoose');

/**
 * Notification Model — الإشعارات
 *
 * بتتعمل notification تلقائي لما:
 *   - الحجز يتأكد   → type: 'booking',   title: 'Booking Confirmed'
 *   - الحجز يكتمل   → type: 'booking',   title: 'Booking Completed'
 *   - الحجز يتلغى   → type: 'cancelled', title: 'Booking Cancelled'
 *   - TODO: أي أحداث تانية يقررها التيم
 *
 * isRead: بتتغير لـ true لما المستخدم يشوف الإشعار
 *
 * ملاحظة: الـ notifications بتتعمل من الـ notificationService
 *   — مش المفروض تتعمل مباشرة من الـ controller
 */
const notificationSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    type:      {
      type: String,
      enum: ['booking', 'cancelled', 'reminder'], // TODO: أضيف أنواع لو احتجنا
      default: 'booking',
    },
    isRead:    { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // ما محتاجش updatedAt هنا
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
