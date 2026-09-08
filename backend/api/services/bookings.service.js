const Booking  = require('../models/booking.model');
const ParkingSpot = require('../models/spot.model');
const Parking  = require('../models/parking.model');

/**
 * Bookings Service — منطق الحجوزات
 *
 * ⚠️ مهم: لما بيتعمل حجز أو بيتغير status، لازم يتعمل notification
 *   استخدم notificationService.createNotification() — شوف notification.service.js
 */

/**
 * makeBooking
 * بيعمل حجز جديد للـ user
 *
 * TODO: اعمل الخطوات دي بالترتيب:
 *   1. دور على أول spot متاح في الجراج ده (status: 'available')
 *   2. لو مفيش → ارجع error "لا توجد أماكن متاحة"
 *   3. غير حالة الـ spot لـ 'booked'
 *   4. احسب totalPrice = pricePerHour * durationHours
 *   5. اعمل الـ booking في الـ DB مع statusHistory أول entry
 *   6. ابعت notification للـ user (استخدم notificationService)
 *
 * @param {{ parkingId, startTime, durationHours, userId }} bookingData
 * @returns {Promise<Object>} الحجز الجديد
 */
async function makeBooking(bookingData) {
  // TODO: implement
}

/**
 * getUserBookings
 * بيجيب كل حجوزات مستخدم معين
 *
 * TODO:
 *   - اجلب الحجوزات وعمل populate على parkingId (name, address) وspotId (spotNumber)
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getUserBookings(userId) {
  // TODO: implement
}

/**
 * updateBookingStatus
 * بيغير حالة الحجز ويضيف entry في الـ statusHistory
 *
 * TODO:
 *   1. عدّل status الـ booking
 *   2. ضيف { status, changedAt: new Date() } في الـ statusHistory
 *   3. لو status = 'completed' أو 'cancelled' → حرر الـ spot (status: 'available')
 *   4. ابعت notification للـ user (استخدم notificationService)
 *
 * @param {string} bookingId
 * @param {string} newStatus - 'active' | 'completed' | 'cancelled'
 * @returns {Promise<Object>}
 */
async function updateBookingStatus(bookingId, newStatus) {
  // TODO: implement
}

// TODO: ممكن تضيف:
//   - getBookingById(bookingId)
//   - getOwnerBookings(ownerId) → كل حجوزات جراجات صاحب الجراج

module.exports = { makeBooking, getUserBookings, updateBookingStatus };
