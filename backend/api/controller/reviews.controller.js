const reviewsService = require('../services/reviews.service');

/**
 * GET /api/reviews/parking/:parkingId
 * Public — no auth required.
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
 * Requires requireAuth.
 * Body: { parkingId, rating, comment? }
 */
async function createReview(req, res, next) {
  try {
    const { parkingId, rating, comment } = req.body;

    if (!parkingId || rating === undefined || rating === null) {
      return res.status(400).json({ success: false, message: 'Please provide a rating' });
    }

    const data = await reviewsService.addReview({
      userId: req.user.id,
      parkingId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
/**
 * GET /api/reviews/my
 * Requires requireAuth.
 */
async function getMyReviews(req, res, next) {
  try {
    const data = await reviewsService.fetchUserReviews(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/reviews/:id
 * Requires requireAuth.
 */
async function deleteReview(req, res, next) {
  try {
    const data = await reviewsService.deleteReview(req.params.id, req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getReviewsByParking,
  createReview,
  getMyReviews,
  deleteReview
};
