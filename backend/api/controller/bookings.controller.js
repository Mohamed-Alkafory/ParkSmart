const bookingsService = require("../services/bookings.service");

/**
 * POST /api/bookings
 * عمل حجز جديد
 */
async function createBooking(req, res, next) {
  try {
    // console.log("🔍 req.user =", req.user);
    const { parkingId, startTime, durationHours } = req.body;

    if (!parkingId || !startTime || !durationHours) {
      return res
        .status(400)
        .json({ success: false, message: "من فضلك أدخل كل البيانات" });
    }

    const data = await bookingsService.makeBooking({
      parkingId,
      startTime,
      durationHours,
      userId: req.user.id || req.user.userId,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bookings/my
 * جلب حجوزات المستخدم الحالي
 */
async function getMyBookings(req, res, next) {
  try {
    const data = await bookingsService.getUserBookings(
      req.user.id || req.user.userId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/bookings/:id/status
 * تغيير حالة حجز
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!["active", "completed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "الحالة غير صحيحة" });
    }

    const data = await bookingsService.updateBookingStatus(
      req.params.id,
      status,
    );
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "الحجز غير موجود" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, getMyBookings, updateStatus };
