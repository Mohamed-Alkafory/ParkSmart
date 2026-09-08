const mongoose = require('mongoose');

/**
 * ParkingSpot Model — الأماكن داخل الجراج
 *
 * كل جراج عنده مجموعة spots، كل spot ليه رقم (A1, A2, B1, ...)
 *
 * status:
 *   - available → متاح للحجز
 *   - booked    → محجوز حالياً
 */
const spotSchema = new mongoose.Schema(
  {
    parkingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
    spotNumber:  { type: String, required: true }, // مثال: "A1", "B2"
    status:      { type: String, enum: ['available', 'booked'], default: 'available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ParkingSpot', spotSchema);
