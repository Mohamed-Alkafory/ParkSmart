const ParkingSpot = require('../models/spot.model');

/**
 * Spots Service — منطق الأماكن داخل الجراج
 *
 * الـ functions دي بتتستدعى من الـ spots.controller
 */

/**
 * fetchSpotsByParking
 * بيجيب كل الـ spots بتاعة جراج معين
 *
 * @param {string} parkingId
 * @returns {Promise<Array>}
 */
async function fetchSpotsByParking(parkingId) {
  // TODO: implement
  // مثال: return await ParkingSpot.find({ parkingId });
}

/**
 * addSpot
 * بيضيف spot جديد لجراج معين
 * المفروض يتستدعى بس من صاحب الجراج (requireRole('owner') في الـ route)
 *
 * @param {{ parkingId, spotNumber }} spotData
 * @returns {Promise<Object>}
 */
async function addSpot(spotData) {
  // TODO: implement
  // مثال: return await ParkingSpot.create(spotData);
}

/**
 * changeSpotStatus
 * بيغير حالة الـ spot يدوي (available / booked)
 * بيتستدعى من صاحب الجراج أو من الـ bookingService تلقائياً
 *
 * @param {string} spotId
 * @param {string} status - 'available' | 'booked'
 * @returns {Promise<Object>}
 */
async function changeSpotStatus(spotId, status) {
  // TODO: implement
  // مثال:
  // return await ParkingSpot.findByIdAndUpdate(spotId, { status }, { new: true });
}

module.exports = { fetchSpotsByParking, addSpot, changeSpotStatus };
