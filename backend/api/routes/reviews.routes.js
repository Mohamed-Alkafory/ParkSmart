const express = require('express');
const router  = express.Router();
const { 
  getReviewsByParking, 
  createReview, 
  getMyReviews, 
  deleteReview 
} = require('../controllers/reviews.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// Public Route: Get reviews for a specific parking
router.get('/parking/:parkingId', getReviewsByParking);

// Protected Routes: Require Authentication
router.get('/my', requireAuth, getMyReviews);
router.post('/', requireAuth, createReview);
router.delete('/:id', requireAuth, deleteReview);

module.exports = router;
