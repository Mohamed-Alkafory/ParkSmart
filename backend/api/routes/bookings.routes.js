const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
  updateStatus,
} = require("../controller/bookings.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

/**
 * Bookings Routes
 * Base: /api/bookings
 *
 * POST /api/bookings            → حجز جديد (أي user مسجل)
 * GET  /api/bookings            → كل الحجوزات (admin فقط)
 * GET  /api/bookings/my         → حجوزاتي (أي user مسجل)
 * GET  /api/bookings/owner      → حجوزات جراجاتي (owner فقط)
 * PATCH /api/bookings/:id/status → تغيير الحالة (صاحب الحجز أو صاحب الجراج أو admin)
 */

router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, requireRole("admin"), getAllBookings);
router.get("/my", requireAuth, getMyBookings);
router.get("/owner", requireAuth, requireRole("owner"), getOwnerBookings);
router.patch("/:id/status", requireAuth, updateStatus);

module.exports = router;
