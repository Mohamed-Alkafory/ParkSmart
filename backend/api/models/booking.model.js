const mongoose = require('mongoose');

/**
 * Booking Model — الحجوزات
 *
 * statusHistory: array بيحفظ كل تغيير في الـ status مع وقته
 *   مثال: [{ status: 'active', changedAt: Date }, { status: 'completed', changedAt: Date }]
 *   ده مفيد لو حبينا نعمل تاريخ للحجز أو نعمل reports
 *
 * status:
 *   - active    → الحجز شغّال دلوقتي
 *   - completed → خلص
 *   - cancelled → اتلغى
 *
 * totalPrice: بيتحسب في الـ service = pricePerHour * durationHours
 */
const bookingSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
    spotId:       { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot',required: true },
    parkingId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Parking',    required: true },
    startTime:    { type: Date,   required: true },
    durationHours:{ type: Number, required: true },
    totalPrice:   { type: Number, required: true },
    status: {
      type:    String,
      enum:    ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    // بيتبع كل تغيير في الحالة مع تاريخه
    statusHistory: [
      {
        status:    { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
