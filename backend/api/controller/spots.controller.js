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
 * GET /api/spots/:id
 * جلب Spot واحد باستخدام الـ ID الخاص به.
 */
async function getSpotById(req, res, next) {
  try {
    const data = await spotsService.fetchSpotById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/spots
 * جلب كل الـ spots — admin فقط (admin/parking-spots page)
 */
async function getAllSpots(req, res, next) {
  try {
    const data = await spotsService.fetchAllSpots();
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

    if (!parkingId || typeof spotNumber !== 'string' || !spotNumber.trim()) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل كل البيانات' });
    }

    // نبعت ID المستخدم من الـ Token للـ service
    // عشان يتأكد إن المستخدم هو صاحب الجراج
    const data = await spotsService.addSpot(
      { parkingId, spotNumber },
      req.user.id
    );

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

    // نبعت ID المستخدم عشان الـ service يتأكد إنه صاحب الجراج.
    const data = await spotsService.changeSpotStatus(
      req.params.id,
      status,
      req.user.id
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function deleteSpot(req, res, next) {
  try {
    // نبعت ID المستخدم عشان الـ service يتأكد إنه صاحب الجراج.
    await spotsService.deleteSpot(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'تم حذف المكان بنجاح'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpotsByParking,
  getSpotById,
  getAllSpots,
  createSpot,
  updateSpotStatus,
  deleteSpot
};
