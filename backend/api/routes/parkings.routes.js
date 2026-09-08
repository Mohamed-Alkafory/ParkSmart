const express = require('express');
const router  = express.Router();
const { getAllParkings, getNearbyParkings, createParking } = require('../controller/parkings.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

/**
 * Parkings Routes
 * Base: /api/parkings
 *
 * GET  /api/parkings          → جلب كل الجراجات (عام)
 * GET  /api/parkings/nearby   → بحث قريب بالموقع (عام)
 * POST /api/parkings          → إضافة جراج (owner فقط)
 *
 * TODO: ممكن تضيف:
 *   - GET    /api/parkings/:id       → تفاصيل جراج معين
 *   - PUT    /api/parkings/:id       → تعديل جراج (owner فقط)
 *   - DELETE /api/parkings/:id       → حذف جراج (owner أو admin)
 */

router.get('/',        getAllParkings);
router.get('/nearby',  getNearbyParkings);
router.post('/',       requireAuth, requireRole('owner'), createParking);

module.exports = router;
