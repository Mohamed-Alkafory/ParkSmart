const Review  = require('../models/review.model');
const Parking = require('../models/parking.model');

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
  // TODO: implement
  // مثال:
  // return await Review.find({ parkingId }).populate('userId', 'name');
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
  // TODO: implement
}

module.exports = { fetchReviewsByParking, addReview };
