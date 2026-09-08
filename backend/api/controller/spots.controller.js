const spotsService = require('../services/spots.service');

/**
 * Spots Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 */

/**
 * GET /api/spots/parking/:parkingId
 * جلب كل الـ spots بتاعة جراج معين
 */
async function getSpotsByParking(req, res, next) {
  try {
    const data = await spotsService.fetchSpotsByParking(req.params.parkingId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/spots
 * إضافة spot جديد — يحتاج requireAuth + requireRole('owner')
 * Body: { parkingId, spotNumber }
 */
async function createSpot(req, res, next) {
  try {
    const { parkingId, spotNumber } = req.body;

    if (!parkingId || !spotNumber) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل كل البيانات' });
    }

    const data = await spotsService.addSpot({ parkingId, spotNumber });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/spots/:id/status
 * تغيير حالة الـ spot يدوي — يحتاج requireAuth + requireRole('owner')
 * Body: { status: 'available' | 'booked' }
 */
async function updateSpotStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!['available', 'booked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'الحالة غير صحيحة' });
    }

    const data = await spotsService.changeSpotStatus(req.params.id, status);
    if (!data) return res.status(404).json({ success: false, message: 'المكان غير موجود' });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSpotsByParking, createSpot, updateSpotStatus };
