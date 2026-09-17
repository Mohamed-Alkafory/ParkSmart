const express = require('express');
const router  = express.Router();
const {
  getAllParkings,
  getNearbyParkings,
  createParking,
  getMyParkings,
  getParkingById,
  updateParking,
  deleteParking,
  uploadParkingImage,
} = require('../controller/parkings.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');

/**
 * Parkings Routes
 * Base: /api/parkings
 *
 * GET    /api/parkings          → all parkings (public)
 * GET    /api/parkings/nearby   → nearby search by location (public)
 * GET    /api/parkings/mine     → current owner's parkings (owner only)
 * GET    /api/parkings/:id      → single parking details (public)
 * POST   /api/parkings          → add a parking (owner only)
 * PUT    /api/parkings/:id      → update a parking (owning owner only)
 * DELETE /api/parkings/:id      → delete a parking (owning owner or admin)
 *
 * Route order matters — /nearby and /mine must come before /:id
 * so Express does not confuse /mine with /:id.
 */

router.get('/',        getAllParkings);
router.get('/nearby',  getNearbyParkings);
router.get('/mine',    requireAuth, requireRole('owner'), getMyParkings);
router.get('/:id',     getParkingById);
router.post('/',       requireAuth, requireRole('owner'), createParking);
router.put('/:id',     requireAuth, requireRole('owner'), updateParking);
router.delete('/:id',  requireAuth, requireRole('owner', 'admin'), deleteParking);
router.post('/:id/image', requireAuth, requireRole('owner'), uploadSingle('image'), uploadParkingImage);

module.exports = router;