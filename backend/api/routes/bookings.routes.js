const express = require('express');
const router  = express.Router();
const { createBooking, getMyBookings, updateStatus } = require('../controller/bookings.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * Bookings Routes
 * Base: /api/bookings
 *
 * POST  /api/bookings          → عمل حجز جديد (driver)
 * GET   /api/bookings/my       → حجوزاتي الحالية (driver)
 * PATCH /api/bookings/:id/status → تغيير حالة حجز
 *
 * ⚠️ كل الـ routes هنا تحتاج requireAuth
 *
 * TODO: ممكن تضيف:
 *   - GET /api/bookings/:id          → تفاصيل حجز معين
 *   - GET /api/bookings/owner        → حجوزات جراجاتي (owner)
 */

router.post('/',              requireAuth, createBooking);
router.get('/my',             requireAuth, getMyBookings);
router.patch('/:id/status',   requireAuth, updateStatus);

module.exports = router;
