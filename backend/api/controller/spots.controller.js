const spotsService = require('../services/spots.service');

/**
 * GET /api/spots/parking/:parkingId
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
 * GET /api/spots — admin only.
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
 * Requires requireAuth + requireRole('owner').
 * Body: { parkingId, spotNumber }
 */
async function createSpot(req, res, next) {
  try {
    const { parkingId, spotNumber } = req.body;

    if (!parkingId || typeof spotNumber !== 'string' || !spotNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

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
 * Requires requireAuth + requireRole('owner').
 * Body: { status: 'available' | 'booked' }
 */
async function updateSpotStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!['available', 'booked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

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
    await spotsService.deleteSpot(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Spot deleted successfully'
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
