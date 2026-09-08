const reviewsService = require('../services/reviews.service');

/**
 * Reviews Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 */

/**
 * GET /api/reviews/parking/:parkingId
 * جلب كل تقييمات جراج معين — متاح للجميع (مش محتاج auth)
 */
async function getReviewsByParking(req, res, next) {
  try {
    const data = await reviewsService.fetchReviewsByParking(req.params.parkingId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/reviews
 * إضافة تقييم جديد — يحتاج requireAuth
 * Body: { parkingId, rating, comment? }
 *
 * الـ service هتحسب وتحدث متوسط الـ rating في الجراج تلقائياً
 */
async function createReview(req, res, next) {
  try {
    const { parkingId, rating, comment } = req.body;

    if (!parkingId || !rating) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل التقييم' });
    }

    const data = await reviewsService.addReview({
      userId: req.user.userId, // جاي من الـ auth middleware
      parkingId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReviewsByParking, createReview };
