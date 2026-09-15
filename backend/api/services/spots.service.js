const ParkingSpot = require('../models/spot.model');
const Parking = require('../models/parking.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');

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
  validateObjectId(parkingId, 'معرّف الجراج غير صالح');

  // نتأكد إن الجراج نفسه موجود بدل ما نرجع قائمة فارغة لجراج غير موجود.
  const parkingExists = await Parking.exists({ _id: parkingId });
  if (!parkingExists) throw createError(404, 'الجراج غير موجود');

  return ParkingSpot.find({ parkingId }).sort({ spotNumber: 1 });
}

/**
 * fetchSpotById
 * بيجيب Spot واحد باستخدام الـ ID الخاص به.
 *
 * @param {string} spotId - ID المكان
 * @returns {Promise<Object>} المكان المطلوب
 * @throws {Error} 400 لو صيغة الـ ID غلط
 * @throws {Error} 404 لو المكان غير موجود
 */
async function fetchSpotById(spotId) {
  validateObjectId(spotId, 'معرّف المكان غير صالح');

  const spot = await ParkingSpot.findById(spotId);
  if (!spot) throw createError(404, 'المكان غير موجود');

  return spot;
}

/**
 * fetchAllSpots
 * بيجيب كل الـ spots — admin فقط
 * بيستخدم في admin/parking-spots page
 *
 * @returns {Promise<Array>}
 */
async function fetchAllSpots() {
  return ParkingSpot.find()
    .populate('parkingId', 'name address')
    .sort({ createdAt: -1 });
}

/**
 * createError
 * بيعمل Error ومعاه HTTP status عشان الـ errorHandler يرجع كود مناسب.
 *
 * @param {number} status - HTTP status code
 * @param {string} message - رسالة الخطأ
 * @returns {Error}
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * validateObjectId
 * بيتأكد إن الـ ID مكتوب بصيغة MongoDB ObjectId صحيحة.
 *
 * @param {string} id - الـ ID المطلوب فحصه
 * @param {string} message - الرسالة في حالة الخطأ
 */
function validateObjectId(id, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, message);
  }
}

/**
 * verifyParkingOwner
 * بيتأكد إن الجراج موجود، وإن المستخدم الحالي هو صاحب الجراج.
 *
 * @param {string} parkingId - ID الجراج
 * @param {string} userId - ID المستخدم الموجود في الـ JWT Token
 * @throws {Error} 404 لو الجراج غير موجود
 * @throws {Error} 403 لو المستخدم مش صاحب الجراج
 */
async function verifyParkingOwner(parkingId, userId) {
  validateObjectId(parkingId, 'معرّف الجراج غير صالح');

  const parking = await Parking.findById(parkingId);

  if (!parking) {
    throw createError(404, 'الجراج غير موجود');
  }

  if (parking.ownerId.toString() !== userId.toString()) {
    throw createError(403, 'أنت لست صاحب هذا الجراج');
  }

  return parking;
}

/**
 * addSpot
 * بيضيف Spot جديد داخل جراج.
 * قبل الإضافة بيتأكد إن المستخدم الحالي هو صاحب الجراج.
 *
 * @param {{ parkingId: string, spotNumber: string }} spotData
 * @param {string} userId - ID المستخدم الموجود في الـ JWT Token
 * @returns {Promise<Object>} الـ Spot الجديد
 */
async function addSpot(spotData, userId) {
  await verifyParkingOwner(spotData.parkingId, userId);

  const spotNumber = spotData.spotNumber.trim().toUpperCase();
  const duplicateSpot = await ParkingSpot.exists({
    parkingId: spotData.parkingId,
    spotNumber,
  });

  if (duplicateSpot) {
    throw createError(409, 'رقم المكان موجود بالفعل داخل هذا الجراج');
  }

  try {
    return await ParkingSpot.create({ ...spotData, spotNumber });
  } catch (err) {
    // الـ unique index يمنع التكرار حتى لو وصل طلبان في نفس اللحظة.
    if (err.code === 11000) {
      throw createError(409, 'رقم المكان موجود بالفعل داخل هذا الجراج');
    }
    throw err;
  }
}

/**
 * changeSpotStatus
 * بيغير حالة الـ spot يدوي (available / booked)
 * بيتستدعى من صاحب الجراج أو من الـ bookingService تلقائياً
 *
 * @param {string} spotId
 * @param {string} status - 'available' | 'booked'
 * @param {string} userId - ID المستخدم الموجود في الـ JWT Token
 * @returns {Promise<Object>}
 */
async function changeSpotStatus(spotId, status, userId) {
  const spot = await fetchSpotById(spotId);

  // بنجيب الجراج المرتبط بالمكان عشان نتأكد إن المستخدم هو صاحبه.
  await verifyParkingOwner(spot.parkingId, userId);

  // مينفعش نخلي مكان متاح يدويًا وفي نفس الوقت عليه حجز نشط.
  if (status === 'available') {
    const activeBooking = await Booking.exists({ spotId, status: 'active' });
    if (activeBooking) {
      throw createError(409, 'لا يمكن إتاحة مكان مرتبط بحجز نشط');
    }
  }

  spot.status = status;
  return spot.save();
}

/**
 * deleteSpot
 * بيحذف Spot بعد التأكد إن المستخدم صاحب الجراج وإن المكان مش محجوز.
 *
 * @param {string} spotId - ID المكان
 * @param {string} userId - ID المستخدم الموجود في الـ JWT Token
 * @returns {Promise<Object>} المكان المحذوف
 */
async function deleteSpot(spotId, userId) {
  const spot = await fetchSpotById(spotId);

  await verifyParkingOwner(spot.parkingId, userId);

  const activeBooking = await Booking.exists({ spotId, status: 'active' });
  if (spot.status === 'booked' || activeBooking) {
    throw createError(409, 'لا يمكن حذف مكان محجوز');
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
