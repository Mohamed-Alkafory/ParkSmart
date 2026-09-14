const express = require('express');
const router  = express.Router();
const { getSpotsByParking, createSpot, updateSpotStatus, deleteSpot } = require('../controller/spots.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

/**
 * Spots Routes
 * Base: /api/spots
 *
 * GET  /api/spots/parking/:parkingId  → جلب الـ spots بتاعة جراج (عام)
 * POST /api/spots                     → إضافة spot (owner فقط)
 * PUT  /api/spots/:id/status          → تغيير حالة spot (owner فقط)
 *
 * TODO: ممكن تضيف:
 *   - DELETE /api/spots/:id → حذف spot (owner فقط)
 */

router.get('/parking/:parkingId', getSpotsByParking);
router.post('/',                  requireAuth, requireRole('owner'), createSpot);
router.put('/:id/status',         requireAuth, requireRole('owner'), updateSpotStatus);
router.delete('/:id',             requireAuth, requireRole('owner'), deleteSpot);

module.exports = router;
