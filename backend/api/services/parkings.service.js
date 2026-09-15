const Parking = require('../models/parking.model');
const ParkingSpot = require('../models/spot.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');

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
 */
async function verifyParkingOwner(parkingId, userId) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  const parking = await Parking.findById(parkingId);

  if (!parking) {
    throw createError(404, 'Parking not found');
  }

  if (parking.ownerId.toString() !== userId.toString()) {
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
 * Only the parking owner may delete.
 *
 * Safe-delete policy (BLOCK, not cascade):
 *   1. Rejects with 409 if any spot of this parking has an active booking.
 *   2. Rejects with 409 if any spots still exist (delete them first).
 * Cascade would permanently destroy spot and booking history, so blocking
 * preserves historical data — same philosophy as deleteSpot.
 *
 * @param {string} parkingId
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function deleteParking(parkingId, userId) {
  const parking = await verifyParkingOwner(parkingId, userId);

  const activeBooking = await Booking.exists({ parkingId, status: 'active' });
  if (activeBooking) {
    throw createError(409, 'Cannot delete a parking with active bookings');
  }

  const spotsCount = await ParkingSpot.countDocuments({ parkingId });
  if (spotsCount > 0) {
    throw createError(409, 'Cannot delete the parking before deleting all of its spots');
  }

  await parking.deleteOne();
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
};