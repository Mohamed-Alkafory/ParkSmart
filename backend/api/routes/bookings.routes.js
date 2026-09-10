const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  updateStatus,
} = require("../controller/bookings.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

/**
 * Bookings Routes
 * Base: /api/bookings
 */

router.post("/", requireAuth, createBooking);
router.get("/my", requireAuth, getMyBookings);
router.patch("/:id/status", requireAuth, updateStatus);

module.exports = router;
