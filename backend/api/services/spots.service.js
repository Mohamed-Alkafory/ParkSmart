const ParkingSpot = require('../models/spot.model');
const Parking = require('../models/parking.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');

/**
 * fetchSpotsByParking
 *
 * @param {string} parkingId
 * @returns {Promise<Array>}
 */
async function fetchSpotsByParking(parkingId) {
  validateObjectId(parkingId, 'Invalid parking ID format');

  // Return 404 for an unknown parking instead of an empty list.
  const parkingExists = await Parking.exists({ _id: parkingId });
  if (!parkingExists) throw createError(404, 'Parking not found');

  return ParkingSpot.find({ parkingId }).sort({ spotNumber: 1 });
}

/**
 * fetchSpotById
 *
 * @param {string} spotId
 * @returns {Promise<Object>}
 * @throws {Error} 400 on malformed ID
 * @throws {Error} 404 when the spot does not exist
 */
async function fetchSpotById(spotId) {
  validateObjectId(spotId, 'Invalid spot ID format');

  const spot = await ParkingSpot.findById(spotId);
  if (!spot) throw createError(404, 'Spot not found');

  return spot;
}

/**
 * fetchAllSpots — admin only.
 *
 * @returns {Promise<Array>}
 */
async function fetchAllSpots() {
  return ParkingSpot.find()
    .populate('parkingId', 'name address')
    .sort({ createdAt: -1 });
}

/**
 * Builds an error carrying an HTTP status for the errorHandler.
 *
 * @param {number} status - HTTP status code
 * @param {string} message
 * @returns {Error}
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Validates a MongoDB ObjectId string.
 *
 * @param {string} id
 * @param {string} message - message on failure
 */
function validateObjectId(id, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, message);
  }
}

/**
 * verifyParkingOwner
 * Ensures the parking exists and the current user owns it.
 *
 * @param {string} parkingId
 * @param {string} userId - user ID from the JWT token
 * @throws {Error} 404 when the parking does not exist
 * @throws {Error} 403 when the user is not the parking owner
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
 * addSpot
 * Adds a spot to a parking after verifying the current user owns it.
 *
 * @param {{ parkingId: string, spotNumber: string }} spotData
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function addSpot(spotData, userId) {
  await verifyParkingOwner(spotData.parkingId, userId);

  const spotNumber = spotData.spotNumber.trim().toUpperCase();
  const duplicateSpot = await ParkingSpot.exists({
    parkingId: spotData.parkingId,
    spotNumber,
  });

  if (duplicateSpot) {
    throw createError(409, 'Spot number already exists in this parking');
  }

  try {
    return await ParkingSpot.create({ ...spotData, spotNumber });
  } catch (err) {
    // The unique index guards against simultaneous duplicate requests.
    if (err.code === 11000) {
      throw createError(409, 'Spot number already exists in this parking');
    }
    throw err;
  }
}

/**
 * changeSpotStatus
 * Manually changes a spot's status (available / booked).
 * Called by the parking owner, or automatically by the booking service.
 *
 * @param {string} spotId
 * @param {string} status - 'available' | 'booked'
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function changeSpotStatus(spotId, status, userId) {
  const spot = await fetchSpotById(spotId);

  await verifyParkingOwner(spot.parkingId, userId);

  // A spot with an active booking must not be force-freed manually.
  if (status === 'available') {
    const activeBooking = await Booking.exists({ spotId, status: 'active' });
    if (activeBooking) {
      throw createError(409, 'Cannot free a spot with an active booking');
    }
  }

  spot.status = status;
  return spot.save();
}

/**
 * deleteSpot
 * Deletes a spot after verifying ownership and that it is not booked.
 *
 * @param {string} spotId
 * @param {string} userId - user ID from the JWT token
 * @returns {Promise<Object>}
 */
async function deleteSpot(spotId, userId) {
  const spot = await fetchSpotById(spotId);

  await verifyParkingOwner(spot.parkingId, userId);

  const activeBooking = await Booking.exists({ spotId, status: 'active' });
  if (spot.status === 'booked' || activeBooking) {
    throw createError(409, 'Cannot delete a booked spot');
  }

  await spot.deleteOne();
  return spot;
}

module.exports = {
  fetchSpotsByParking,
  fetchSpotById,
  fetchAllSpots,
  addSpot,
  changeSpotStatus,
  deleteSpot
};
