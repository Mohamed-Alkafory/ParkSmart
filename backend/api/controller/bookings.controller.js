const bookingsService = require("../services/bookings.service");

/**
 * POST /api/bookings
 * Body: { parkingId, startTime, durationHours, spotId? }
 * spotId is optional — books that exact spot if given, otherwise auto-assigns
 * the first available spot.
 */
async function createBooking(req, res, next) {
  try {
    const { parkingId, startTime, durationHours, spotId } = req.body;

    if (!parkingId || !startTime || !durationHours) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all required fields" });
    }

    const data = await bookingsService.makeBooking({
      parkingId,
      startTime,
      durationHours,
      userId: req.user.id,
      ...(spotId ? { spotId } : {}),
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bookings/my
 */
async function getMyBookings(req, res, next) {
  try {
    const data = await bookingsService.getUserBookings(
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bookings/owner
 * Bookings of all parkings owned by the current owner.
 */
async function getOwnerBookings(req, res, next) {
  try {
    const data = await bookingsService.getOwnerBookings(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bookings
 * All bookings — admin only.
 */
async function getAllBookings(req, res, next) {
  try {
    const data = await bookingsService.getAllBookings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/bookings/:id/status
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!["active", "completed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const data = await bookingsService.updateBookingStatus(
      req.params.id,
      status,
      req.user, // { id, role } — booking owner, parking owner, or admin
    );
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, getMyBookings, getOwnerBookings, getAllBookings, updateStatus };
