const Parking = require('../models/parking.model');
const ParkingSpot = require('../models/spot.model');
const Booking = require('../models/booking.model');
const Review = require('../models/review.model');
const mongoose = require('mongoose');
const { deleteUploadByUrl } = require('../middlewares/upload.middleware');

/**
 * Builds an error carrying an HTTP status for the errorHandler.
 * Same pattern as spots.service.js.
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Validates a MongoDB ObjectId string.
 */
function validateObjectId(id, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, message);
  }
}

/**
 * verifyParkingOwner
 * Ensures the parking exists and the current user owns it.
 * Admins bypass the ownership check (role comes from the JWT, no extra lookup).
 */
async function verifyParkingOwner(parkingId, userId, role) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  const parking = await Parking.findById(parkingId);

  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  if (role !== 'admin' && parking.ownerId.toString() !== userId.toString()) {
    throw createError(403, 'You are not the owner of this parking');
  }

  return parking;
}

/**
 * fetchAllParkings
 * All parkings, newest first.
 *
 * @returns {Promise<Array>}
 */
async function fetchAllParkings() {
  return await Parking.find().sort({ createdAt: -1 });
}

/**
 * fetchNearbyParkings
 * Parkings near a location using a GeoJSON $near query.
 * Relies on the 2dsphere index on the location field in the Parking model.
 *
 * @param {{ lat: number, lng: number, maxDistance: number }} params
 * @returns {Promise<Array>}
 */
async function fetchNearbyParkings({ lat, lng, maxDistance = 5000 }) {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  let parsedMaxDistance = parseInt(maxDistance, 10);
  if (Number.isNaN(parsedMaxDistance) || parsedMaxDistance <= 0) {
    parsedMaxDistance = 5000;
  }

  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
    throw createError(400, 'Invalid coordinates (lat and lng must be numbers)');
  }
  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    throw createError(400, 'Coordinates out of range');
  }

  return await Parking.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parsedLng, parsedLat] },
        $maxDistance: parsedMaxDistance,
      },
    },
  });
}

/**
 * addParking
 * Creates a parking. ownerId comes from the JWT token (req.user.id).
 *
 * @param {{ name, address, pricePerHour, lat, lng, ownerId }} parkingData
 * @returns {Promise<Object>}
 */
async function addParking(parkingData) {
  const { name, address, pricePerHour, lat, lng, ownerId } = parkingData;

  if (!name || !address || pricePerHour === undefined || lat === undefined || lng === undefined || !ownerId) {
    throw createError(400, 'Please provide all required fields');
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const parsedPrice = parseFloat(pricePerHour);

  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
    throw createError(400, 'Invalid coordinates (lat and lng must be numbers)');
  }
  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    throw createError(400, 'Coordinates out of range');
  }
  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    throw createError(400, 'Invalid price');
  }

  return await Parking.create({
    name,
    address,
    pricePerHour: parsedPrice,
    ownerId,
    location: { type: 'Point', coordinates: [parsedLng, parsedLat] },
  });
}

/**
 * fetchParkingById
 *
 * @param {string} parkingId
 * @returns {Promise<Object>}
 */
async function fetchParkingById(parkingId) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  return parking;
}

/**
 * fetchOwnerParkings
 * Parkings owned by a given owner.
 *
 * @param {string} ownerId - owner ID from the JWT token
 * @returns {Promise<Array>}
 */
async function fetchOwnerParkings(ownerId) {
  return await Parking.find({ ownerId }).sort({ createdAt: -1 });
}

/**
 * updateParking
 * Only the parking owner may update. Editable fields only:
 * name, address, pricePerHour, location (via lat/lng).
 *
 * @param {string} parkingId
 * @param {{ name, address, pricePerHour, lat, lng }} data
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function updateParking(parkingId, data, userId) {
  const parking = await verifyParkingOwner(parkingId, userId);

  if (data.name !== undefined) parking.name = data.name;
  if (data.address !== undefined) parking.address = data.address;
  if (data.pricePerHour !== undefined) {
    const parsedPrice = parseFloat(data.pricePerHour);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      throw createError(400, 'Invalid price');
    }
    parking.pricePerHour = parsedPrice;
  }

  if (data.lat !== undefined || data.lng !== undefined) {
    if (data.lat === undefined || data.lng === undefined) {
      throw createError(400, 'To update the location, both lat and lng are required');
    }
    const parsedLat = parseFloat(data.lat);
    const parsedLng = parseFloat(data.lng);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      throw createError(400, 'Invalid coordinates (lat and lng must be numbers)');
    }
    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      throw createError(400, 'Coordinates out of range');
    }
    parking.location = { type: 'Point', coordinates: [parsedLng, parsedLat] };
  }

  return await parking.save();
}

/**
 * deleteParking
 * Only the parking owner or an admin may delete.
 *
 * Safe-delete policy:
 *   1. Rejects with 409 if any booking of this parking is still active
 *      (always blocked — drivers could be parked there right now).
 *   2. Rejects with 409 if any booking (even completed/cancelled) references
 *      this parking's spots, unless force is true — deleting them would
 *      orphan booking history (frontend shows "Deleted parking" instead).
 *   3. Otherwise the parking's spots (and its now-unreachable reviews) are
 *      removed together with it, so owners don't delete spots by hand first.
 * Cascade would permanently destroy spot and booking history, so blocking
 * preserves historical data — same philosophy as deleteSpot.
 *
 * @param {string} parkingId
 * @param {string} userId - user ID from the JWT token
 * @param {string} role - role from the JWT token ('admin' bypasses ownership)
 * @param {boolean} force - delete despite non-active booking history
 * @returns {Promise<Object>}
 */
async function deleteParking(parkingId, userId, role, force = false) {
  const parking = await verifyParkingOwner(parkingId, userId, role);

  const activeBooking = await Booking.exists({ parkingId, status: 'active' });
  if (activeBooking) {
    throw createError(409, 'Cannot delete a parking with active bookings');
  }

  const spotIds = await ParkingSpot.find({ parkingId }).select('_id');
  if (spotIds.length > 0) {
    const hasHistory = await Booking.exists({
      spotId: { $in: spotIds.map((s) => s._id) },
    });
    if (hasHistory && !force) {
      throw createError(409, 'Cannot delete a parking with booking history');
    }
    await ParkingSpot.deleteMany({ parkingId });
  }

  // Reviews belong to the parking — unreachable once it is gone.
  await Review.deleteMany({ parkingId });

  const imageUrl = parking.imageUrl;
  await parking.deleteOne();
  if (imageUrl) deleteUploadByUrl(imageUrl);
  return parking;
}

/**
 * setParkingImage
 * Replaces a parking's image. Owner-only check mirroring the
 * verifyParkingOwner pattern from spots.service.js: the parking must
 * exist and the current user must own it. Removes the previous upload
 * from disk so orphaned files do not accumulate (best-effort).
 *
 * @param {string} parkingId
 * @param {string} imageUrl - e.g. "/uploads/123-abc.png"
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function setParkingImage(parkingId, imageUrl, userId) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw createError(404, 'Parking not found');
  }
  if (parking.ownerId.toString() !== userId.toString()) {
    throw createError(403, 'You are not the owner of this parking');
  }

  const oldUrl = parking.imageUrl;
  parking.imageUrl = imageUrl;
  await parking.save();

  if (oldUrl && oldUrl !== imageUrl) deleteUploadByUrl(oldUrl);

  return parking;
}

module.exports = {
  fetchAllParkings,
  fetchNearbyParkings,
  addParking,
  fetchParkingById,
  fetchOwnerParkings,
  updateParking,
  deleteParking,
  verifyParkingOwner,
  setParkingImage,
};
