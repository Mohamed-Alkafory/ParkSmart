const parkingsService = require('../services/parkings.service');

/**
 * GET /api/parkings
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
 * maxDistance in meters, defaults to 5000 (5 km).
 */
async function getNearbyParkings(req, res, next) {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Location is required (lat, lng)' });
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
 * Requires requireAuth + requireRole('owner').
 * Body: { name, address, pricePerHour, lat, lng }
 */
async function createParking(req, res, next) {
  try {
    const { name, address, pricePerHour, lat, lng } = req.body;

    if (!name || !address || !pricePerHour || !lat || !lng) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const data = await parkingsService.addParking({
      name, address, pricePerHour, lat, lng,
      ownerId: req.user.id,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/parkings/mine
 * Parkings of the current owner. Requires requireAuth + requireRole('owner').
 */
async function getMyParkings(req, res, next) {
  try {
    const data = await parkingsService.fetchOwnerParkings(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/parkings/:id
 */
async function getParkingById(req, res, next) {
  try {
    const data = await parkingsService.fetchParkingById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/parkings/:id
 * Requires requireAuth + requireRole('owner') + ownership check.
 * Body (at least one field): { name, address, pricePerHour, lat, lng }
 * Note: lat and lng must be sent together to update the location.
 */
async function updateParking(req, res, next) {
  try {
    const { name, address, pricePerHour, lat, lng } = req.body;

    if (
      name === undefined &&
      address === undefined &&
      pricePerHour === undefined &&
      lat === undefined &&
      lng === undefined
    ) {
      return res.status(400).json({ success: false, message: 'Please provide at least one field to update' });
    }

    const data = await parkingsService.updateParking(
      req.params.id,
      { name, address, pricePerHour, lat, lng },
      req.user.id
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/parkings/:id
 * Requires requireAuth + requireRole('owner', 'admin').
 * Owners pass the ownership check; admins bypass it.
 * Rejected with 409 if there are active bookings or remaining spots.
 */
async function deleteParking(req, res, next) {
  try {
    await parkingsService.deleteParking(req.params.id, req.user.id, req.user.role);

    res.json({
      success: true,
      message: 'Parking deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllParkings, getNearbyParkings, createParking, getMyParkings, getParkingById, updateParking, deleteParking };
