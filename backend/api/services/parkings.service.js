const Parking = require('../models/parking.model');

/**
 * Parkings Service — منطق الجراجات
 *
 * الـ functions دي بتتستدعى من الـ parkings.controller
 * كل function بتتعامل مع الـ DB وبترجع البيانات للـ controller
 */

/**
 * fetchAllParkings
 * TODO: اجلب كل الجراجات من الـ DB
 *
 * @returns {Promise<Array>} قايمة الجراجات
 */
async function fetchAllParkings() {
  // TODO: implement
  // مثال: return await Parking.find();
}

/**
 * fetchNearbyParkings
 * بيجيب الجراجات القريبة من موقع معين باستخدام GeoJSON $near query
 * ⚠️ لازم يكون في 2dsphere index على الـ location field في الـ Parking model
 *
 * @param {{ lat: number, lng: number, maxDistance: number }} params
 * @returns {Promise<Array>} قايمة الجراجات القريبة
 */
async function fetchNearbyParkings({ lat, lng, maxDistance }) {
  // TODO: implement
  // مثال:
  // return await Parking.find({
  //   location: {
  //     $near: {
  //       $geometry: { type: 'Point', coordinates: [lng, lat] },
  //       $maxDistance: maxDistance,
  //     },
  //   },
  // });
}

/**
 * addParking
 * بيضيف جراج جديد في الـ DB
 * ownerId بيجي من الـ JWT token (req.user.userId في الـ controller)
 *
 * @param {{ name, address, pricePerHour, lat, lng, ownerId }} parkingData
 * @returns {Promise<Object>} الجراج الجديد
 */
async function addParking(parkingData) {
  // TODO: implement
  // مثال:
  // const { name, address, pricePerHour, lat, lng, ownerId } = parkingData;
  // return await Parking.create({
  //   name, address, pricePerHour, ownerId,
  //   location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
  // });
}

// TODO: ممكن تضيف functions زي:
//   - getParkingById(id)
//   - updateParking(id, data)
//   - deleteParking(id)

module.exports = { fetchAllParkings, fetchNearbyParkings, addParking };
