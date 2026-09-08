const mongoose = require('mongoose');

/**
 * Review Model — التقييمات
 *
 * كل review بتاعة user على parking معين
 * rating: من 1 لـ 5
 *
 * ملاحظة: لما بيتضاف review جديد، لازم يتحدث الـ rating
 * في الـ Parking document — ده بيتعمل في الـ reviewsService
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
