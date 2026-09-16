const Review = require('../models/review.model');
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
  if (!parkingId || !mongoose.isValidObjectId(parkingId)) {
    throw createError(400, 'Invalid parking ID');
  }

  const parking = await Parking.findById(parkingId).select('_id');
  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  return await Review.find({ parkingId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
}

/**
 * addReview
 * Creates a review and updates the parking's average rating.
 * The user must have a non-cancelled booking (active or completed)
 * for that parking before reviewing it.
 * Repeat reviews upsert: an existing review is updated, not duplicated.
 *
 * @param {{ userId, parkingId, rating, comment }} reviewData
 * @returns {Promise<Object>}
 */
async function addReview(reviewData) {
  const { userId, parkingId, rating, comment } = reviewData;

  if (!userId || !parkingId || rating === undefined || rating === null) {
    throw createError(400, 'Missing review data (userId, parkingId, rating are required)');
  }

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(parkingId)) {
    throw createError(400, 'Invalid user ID or parking ID');
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    throw createError(400, 'Rating must be a number between 1 and 5');
  }

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  // The user must have a non-cancelled booking for this parking before reviewing it.
  const hasBooking = await Booking.exists({
    userId,
    parkingId,
    status: { $in: ['active', 'completed'] },
  });
  if (!hasBooking) {
    throw createError(403, 'You can only review a parking you have booked before');
  }

  // Upsert: update the existing review instead of creating a duplicate.
  let review = await Review.findOne({ userId, parkingId });
  if (review) {
    review.rating = numericRating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
  } else {
    review = new Review({ userId, parkingId, rating: numericRating, comment });
    await review.save();
  }

  // Recompute the average rating from all reviews of this parking.
  const reviews = await Review.find({ parkingId }).select('rating');
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Update the rating on the Parking document (rounded to one decimal).
  parking.rating = Math.round(avg * 10) / 10;
  await parking.save();

  await review.populate('userId', 'name');
  return review;
}
async function fetchUserReviews(userId) {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw createError(400, 'Invalid user ID');
  }

  return await Review.find({ userId })
    .populate('parkingId', 'name address')
    .sort({ createdAt: -1 });
}

async function deleteReview(reviewId, user) {
  if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
    throw createError(400, 'Invalid review ID');
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw createError(404, 'Review not found');
  }

  if (review.userId.toString() !== user.id && user.role !== 'admin') {
    throw createError(403, 'You are not allowed to delete this review');
  }

  const parkingId = review.parkingId;
  await Review.findByIdAndDelete(reviewId);

  const parking = await Parking.findById(parkingId);
  if (parking) {
    const reviews = await Review.find({ parkingId }).select('rating');
    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    parking.rating = Math.round(avg * 10) / 10;
    await parking.save();
  }

  return { message: 'Review deleted successfully' };
}
module.exports = {
  fetchReviewsByParking,
  addReview,
  fetchUserReviews,
  deleteReview
};
