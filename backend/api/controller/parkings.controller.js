const parkingsService = require('../services/parkings.service');

/**
 * Parkings Controller
 * مهمته: يستقبل الـ request، يبعته للـ service، يرجع الـ response
 */

/**
 * GET /api/parkings
 * جلب كل الجراجات
 */
async function getAllParkings(req, res, next) {
  try {
    const data = await parkingsService.fetchAllParkings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/parkings/nearby?lat=26.1551&lng=32.7266&maxDistance=5000
 * بحث عن الجراجات القريبة من موقع معين
 * maxDistance: بالمتر، الافتراضي 5000 متر (5 كيلو)
 */
async function getNearbyParkings(req, res, next) {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'الموقع مطلوب (lat, lng)' });
    }

    const data = await parkingsService.fetchNearbyParkings({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      maxDistance: parseInt(maxDistance),
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/parkings
 * إضافة جراج جديد — يحتاج requireAuth + requireRole('owner')
 * Body: { name, address, pricePerHour, lat, lng }
 */
async function createParking(req, res, next) {
  try {
    const { name, address, pricePerHour, lat, lng } = req.body;

    if (!name || !address || !pricePerHour || !lat || !lng) {
      return res.status(400).json({ success: false, message: 'من فضلك أدخل كل البيانات' });
    }

    const data = await parkingsService.addParking({
      name, address, pricePerHour, lat, lng,
      ownerId: req.user.userId, // جاي من الـ auth middleware
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// TODO: ممكن تضيف:
//   - getParkingById
//   - updateParking
//   - deleteParking

module.exports = { getAllParkings, getNearbyParkings, createParking };
