const express = require('express');
const router  = express.Router();
const {
  getSpotsByParking,
  getSpotById,
  getAllSpots,
  createSpot,
  updateSpotStatus,
  deleteSpot,
} = require('../controller/spots.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

/**
 * Spots Routes
 * Base: /api/spots
 *
 * GET    /api/spots                     → all spots (admin only)
 * GET    /api/spots/parking/:parkingId  → spots of a parking (public)
 * GET    /api/spots/:id                 → single spot (public)
 * POST   /api/spots                     → add a spot (owner only)
 * PUT    /api/spots/:id/status          → change spot status (owner only)
 * DELETE /api/spots/:id                 → delete a spot (owner only)
 */

router.get('/',                  requireAuth, requireRole('admin'), getAllSpots);
router.get('/parking/:parkingId', getSpotsByParking);
router.get('/:id',                getSpotById);
router.post('/',                  requireAuth, requireRole('owner'), createSpot);
router.put('/:id/status',         requireAuth, requireRole('owner'), updateSpotStatus);
router.delete('/:id',             requireAuth, requireRole('owner'), deleteSpot);

module.exports = router;
