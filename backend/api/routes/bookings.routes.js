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
 * POST /api/bookings              → create a booking (any authenticated user)
 * GET  /api/bookings              → all bookings (admin only)
 * GET  /api/bookings/my           → current user's bookings (any authenticated user)
 * GET  /api/bookings/owner        → bookings of the owner's parkings (owner only)
 * PATCH /api/bookings/:id/status  → change status (booking owner, parking owner, or admin)
 */

router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, requireRole("admin"), getAllBookings);
router.get("/my", requireAuth, getMyBookings);
router.get("/owner", requireAuth, requireRole("owner", "admin"), getOwnerBookings);
router.patch("/:id/status", requireAuth, updateStatus);

module.exports = router;
