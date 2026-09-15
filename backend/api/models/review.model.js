const mongoose = require('mongoose');

/**
 * Review Model
 *
 * Each review belongs to a user on a specific parking.
 * rating: 1 to 5.
 *
 * Note: when a new review is added, the Parking rating field
 * must be updated — handled in the reviews service.
 */
const reviewSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    comment:   { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
