const mongoose = require('mongoose');
const Review  = require('../models/review.model');
const Parking = require('../models/parking.model');
const Booking = require('../models/booking.model');

/**
 * Reviews Service — منطق التقييمات
 *
 * الـ functions دي بتتستدعى من الـ reviews.controller
 */

/**
 * fetchReviewsByParking
 * بيجيب كل تقييمات جراج معين
 *
 * TODO:
 *   - اجلب الـ reviews الخاصة بالـ parkingId
 *   - عمل populate على userId عشان يجيب اسم المستخدم
 *
 * @param {string} parkingId
 * @returns {Promise<Array>}
 */
async function fetchReviewsByParking(parkingId) {
  if (!parkingId || !mongoose.isValidObjectId(parkingId)) {
    const err = new Error('Invalid parking ID');
    err.status = 400;
    throw err;
  }

  const parking = await Parking.findById(parkingId).select('_id');
  if (!parking) {
    const err = new Error('Parking not found');
    err.status = 404;
    throw err;
  }

  return await Review.find({ parkingId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
}

/**
 * addReview
 * بيضيف تقييم جديد ويحدّث متوسط الـ rating في الجراج
 *
 * TODO: اعمل الخطوات دي:
 *   1. ساف الـ review في الـ DB
 *   2. اجلب كل الـ reviews بتاعة الجراج ده
 *   3. احسب متوسط الـ rating
 *   4. حدّث الـ rating في الـ Parking document
 *
 * @param {{ userId, parkingId, rating, comment }} reviewData
 * @returns {Promise<Object>}
 */
async function addReview(reviewData) {
  const { userId, parkingId, rating, comment } = reviewData;

  if (!userId || !parkingId || rating === undefined || rating === null) {
    const err = new Error('Missing review data (userId, parkingId, rating are required)');
    err.status = 400;
    throw err;
  }

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(parkingId)) {
    const err = new Error('Invalid user ID or parking ID');
    err.status = 400;
    throw err;
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    const err = new Error('Rating must be a number between 1 and 5');
    err.status = 400;
    throw err;
  }

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    const err = new Error('Parking not found');
    err.status = 404;
    throw err;
  }

  // لازم يكون الـ user عنده حجز (غير ملغي) في الجراج ده قبل ما يقيّمه
  const hasBooking = await Booking.exists({
    userId,
    parkingId,
    status: { $in: ['active', 'completed'] },
  });
  if (!hasBooking) {
    const err = new Error('لا يمكنك تقييم جراج لم تقم بالحجز فيه');
    err.status = 403;
    throw err;
  }

  // 1. ساف الـ review في الـ DB (لو قيّم قبل كده حدّث تقييمه بدل ما تكرره)
  let review = await Review.findOne({ userId, parkingId });
  if (review) {
    review.rating = numericRating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
  } else {
    review = new Review({ userId, parkingId, rating: numericRating, comment });
    await review.save();
  }

  // 2 + 3. اجلب كل الـ reviews بتاعة الجراج ده واحسب متوسط الـ rating
  const reviews = await Review.find({ parkingId }).select('rating');
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // 4. حدّث الـ rating في الـ Parking document (مقرب لرقم عشري واحد)
  parking.rating = Math.round(avg * 10) / 10;
  await parking.save();

  await review.populate('userId', 'name');
  return review;
}

module.exports = { fetchReviewsByParking, addReview };
