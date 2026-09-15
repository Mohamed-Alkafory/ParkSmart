const mongoose = require('mongoose');

/**
 * ParkingSpot Model — spots inside a parking.
 *
 * Each parking has a set of spots, each with a number (A1, A2, B1, ...).
 *
 * status:
 *   - available → bookable
 *   - booked    → currently booked
 */
const spotSchema = new mongoose.Schema(
  {
    parkingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
    spotNumber:  {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 1,
    },
    status:      { type: String, enum: ['available', 'booked'], default: 'available' },
  },
  { timestamps: true }
);

// A spot number must be unique within its own parking.
// The same number may repeat in a different parking.
spotSchema.index({ parkingId: 1, spotNumber: 1 }, { unique: true });

module.exports = mongoose.model('ParkingSpot', spotSchema);
