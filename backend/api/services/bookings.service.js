const Booking = require("../models/booking.model");
const ParkingSpot = require("../models/spot.model");
const Parking = require("../models/parking.model");

/**
 * makeBooking
 * بيعمل حجز جديد
 */
async function makeBooking(bookingData) {
  const { parkingId, startTime, durationHours, userId } = bookingData;

  if (!parkingId || !startTime || !durationHours || !userId) {
    throw new Error("Missing booking data");
  }

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw new Error("Parking not found");
  }

  const spot = await ParkingSpot.findOne({ parkingId, status: "available" });
  if (!spot) {
    throw new Error("No available spots");
  }

  const totalPrice = parking.pricePerHour * durationHours;

  spot.status = "booked";
  await spot.save();

  const booking = new Booking({
    parkingId,
    spotId: spot._id,
    userId,
    startTime,
    durationHours,
    totalPrice,
    status: "active",
    statusHistory: [{ status: "active", changedAt: new Date() }],
  });

  await booking.save();
  return booking;
}

/**
 * getUserBookings
 * بيجيب كل حجوزات مستخدم معين
 */
async function getUserBookings(userId) {
  return await Booking.find({ userId })
    .populate("parkingId", "name address")
    .populate("spotId", "spotNumber");
}

/**
 * updateBookingStatus
 * بيغير حالة الحجز
 */
async function updateBookingStatus(bookingId, newStatus) {
  const validStatuses = ["active", "completed", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === newStatus) {
    throw new Error("New status is same as current status");
  }

  booking.status = newStatus;
  booking.statusHistory.push({ status: newStatus, changedAt: new Date() });

  if (newStatus === "completed" || newStatus === "cancelled") {
    const spot = await ParkingSpot.findById(booking.spotId);
    if (spot) {
      spot.status = "available";
      await spot.save();
    }
  }

  await booking.save();
  return booking;
}

module.exports = { makeBooking, getUserBookings, updateBookingStatus };
