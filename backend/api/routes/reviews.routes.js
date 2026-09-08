const express = require('express');
const router  = express.Router();
const { getReviewsByParking, createReview } = require('../controller/reviews.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * Reviews Routes
 * Base: /api/reviews
 *
 * GET  /api/reviews/parking/:parkingId → تقييمات جراج معين (عام)
 * POST /api/reviews                    → إضافة تقييم (driver — لازم يكون عنده حجز قديم في الجراج ده)
 *
 * TODO: ممكن تضيف:
 *   - DELETE /api/reviews/:id → حذف تقييم (صاحبه أو admin)
 *   - التحقق إن الـ user عمل حجز في الجراج ده قبل ما يقدر يقيّمه
 */

router.get('/parking/:parkingId', getReviewsByParking);
router.post('/',                  requireAuth, createReview);

module.exports = router;
