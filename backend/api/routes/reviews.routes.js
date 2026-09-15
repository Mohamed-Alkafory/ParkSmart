const express = require('express');
const router  = express.Router();
const { getReviewsByParking, createReview } = require('../controller/reviews.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * Reviews Routes
 * Base: /api/reviews
 *
 * GET  /api/reviews/parking/:parkingId → reviews of a parking (public)
 * POST /api/reviews                    → add a review (must have booked the parking before)
 *
 * Possible addition:
 *   - DELETE /api/reviews/:id → delete a review (its author or admin)
 */

router.get('/parking/:parkingId', getReviewsByParking);
router.post('/',                  requireAuth, createReview);

module.exports = router;
