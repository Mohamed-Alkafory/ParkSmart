const bookingsService = require('../services/bookings.service');

/**
 * Bookings Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 *
 * ⚠️ كل الـ routes هنا تحتاج requireAuth على الأقل
 */

/**
 * POST /api/bookings
 * عمل حجز جديد — يحتاج requireAuth
 * Body: { parkingId, startTime, durationHours }
 *
 * الـ service هتبعت notification تلقائي لما الحجز يتعمل
 */
async function createBooking(req, res, next) {
  try {
    const { parkingId, startTime, durationHours } = req.body;

    if (!parkingId || !startTime || !durationHours) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل كل البيانات' });
    }

    const data = await bookingsService.makeBooking({
      parkingId,
      startTime,
      durationHours,
      userId: req.user.userId, // جاي من الـ auth middleware
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bookings/my
 * جلب حجوزات المستخدم الحالي — يحتاج requireAuth
 */
async function getMyBookings(req, res, next) {
  try {
    const data = await bookingsService.getUserBookings(req.user.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/bookings/:id/status
 * تغيير حالة حجز — يحتاج requireAuth
 * Body: { status: 'completed' | 'cancelled' }
 *
 * الـ service هتبعت notification تلقائي عند تغيير الحالة
 * وهتحرر الـ spot لو الحجز اتلغى أو اكتمل
 *
 * TODO: قرر مين يقدر يغير الحالة — الـ user نفسه؟ أو الـ owner فقط؟
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'الحالة غير صحيحة' });
    }

    const data = await bookingsService.updateBookingStatus(req.params.id, status);
    if (!data) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, getMyBookings, updateStatus };
