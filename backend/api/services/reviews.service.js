const Review  = require('../models/review.model');
const Parking = require('../models/parking.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');

/**
 * Builds an error carrying an HTTP status for the errorHandler.
 * Same pattern as spots.service.js.
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Validates a MongoDB ObjectId string.
 */
function validateObjectId(id, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, message);
  }
}

/**
 * fetchReviewsByParking
 * All reviews of a parking, with the reviewer name, newest first.
 *
 * @param {string} parkingId
 * @returns {Promise<Array>}
 */
async function fetchReviewsByParking(parkingId) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  const parkingExists = await Parking.exists({ _id: parkingId });
  if (!parkingExists) throw createError(404, 'Parking not found');

  return await Review.find({ parkingId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
}

/**
 * recalculateParkingRating
 * Recomputes the average of all reviews and updates the Parking rating field.
 *
 * @param {string} parkingId
 */
async function recalculateParkingRating(parkingId) {
  const result = await Review.aggregate([
    { $match: { parkingId: new mongoose.Types.ObjectId(parkingId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);

  const avgRating = result.length > 0 ? result[0].avgRating : 0;
  await Parking.findByIdAndUpdate(parkingId, { rating: avgRating });
}

/**
 * addReview
 * Creates a review and updates the parking's average rating.
 * The user must have at least one booking for that parking
 * (any status — what matters is they have used the parking before).
 *
 * @param {{ userId, parkingId, rating, comment }} reviewData
 * @returns {Promise<Object>}
 */
async function addReview(reviewData) {
  const { userId, parkingId, rating, comment } = reviewData;

  if (!userId || !parkingId || rating === undefined) {
    throw createError(400, 'Please provide all required fields');
  }

  validateObjectId(parkingId, 'Invalid parking ID format');

  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw createError(400, 'Rating must be an integer from 1 to 5');
  }

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  const hasBooking = await Booking.exists({ userId, parkingId });
  if (!hasBooking) {
    throw createError(403, 'You can only review a parking you have booked before');
  }

  const review = await Review.create({
    userId,
    parkingId,
    rating: parsedRating,
    comment,
  });

  await recalculateParkingRating(parkingId);

  return review;
}

module.exports = { fetchReviewsByParking, addReview };
