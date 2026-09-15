const Booking = require("../models/booking.model");
const ParkingSpot = require("../models/spot.model");
const Parking = require("../models/parking.model");
const notificationService = require("./notification.service");
const mongoose = require("mongoose");

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
 * makeBooking
 * Creates a booking + automatic notification (Booking Confirmed).
 * spotId is optional: books that exact spot if given, otherwise
 * auto-picks the first available spot.
 */
async function makeBooking(bookingData) {
  const { parkingId, startTime, durationHours, userId, spotId } = bookingData;

  if (!parkingId || !startTime || !durationHours || !userId) {
    throw new Error("Missing booking data");
  }

  const parking = await Parking.findById(parkingId);
  if (!parking) {
    throw new Error("Parking not found");
  }

  let spot;
  if (spotId) {
    if (!mongoose.isValidObjectId(spotId)) {
      throw createError(400, "Invalid spot ID format");
    }
    spot = await ParkingSpot.findById(spotId);
    if (!spot) {
      throw createError(404, "Spot not found");
    }
    if (spot.parkingId.toString() !== parkingId.toString()) {
      throw createError(400, "This spot does not belong to the requested parking");
    }
    if (spot.status !== "available") {
      throw createError(409, "This spot was just booked. Please choose another one");
    }
  } else {
    spot = await ParkingSpot.findOne({ parkingId, status: "available" });
    if (!spot) {
      throw new Error("No available spots");
    }
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

  // Best-effort notification — a failure must not break the booking.
  try {
    await notificationService.createNotification({
      userId,
      bookingId: booking._id,
      title: "Booking Confirmed",
      message: `Your booking at ${parking.name} is confirmed.`,
      type: "booking",
    });
  } catch (err) {
    console.error("Notification failed:", err.message);
  }

  return booking;
}

/**
 * getUserBookings
 * All bookings of a given user.
 */
async function getUserBookings(userId) {
  return await Booking.find({ userId })
    .populate("parkingId", "name address")
    .populate("spotId", "spotNumber");
}

/**
 * getOwnerBookings
 * Bookings of all parkings owned by a given owner.
 */
async function getOwnerBookings(ownerId) {
  const parkings = await Parking.find({ ownerId }).select("_id");
  return await Booking.find({ parkingId: { $in: parkings.map((p) => p._id) } })
    .populate("parkingId", "name address")
    .populate("spotId", "spotNumber")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
}

/**
 * getAllBookings — admin only.
 */
async function getAllBookings() {
  return await Booking.find()
    .populate("parkingId", "name address")
    .populate("spotId", "spotNumber")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
}

/**
 * updateBookingStatus
 * Changes a booking's status + automatic notification (Completed/Cancelled).
 * Allowed for the booking owner, the parking owner, or an admin.
 */
async function updateBookingStatus(bookingId, newStatus, requester) {
  const validStatuses = ["active", "completed", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (requester) {
    const parking = await Parking.findById(booking.parkingId).select("ownerId name");
    const isBookingOwner = booking.userId.toString() === requester.id;
    const isParkingOwner =
      parking && parking.ownerId.toString() === requester.id;
    if (!isBookingOwner && !isParkingOwner && requester.role !== "admin") {
      const err = new Error("You are not allowed to access this resource");
      err.status = 403;
      throw err;
    }
  }

  if (booking.status === newStatus) {
    throw new Error("New status is same as current status");
  }

  booking.status = newStatus;
  booking.statusHistory.push({ status: newStatus, changedAt: new Date() });

  // Freed spots become bookable again once the booking ends or is cancelled.
  if (newStatus === "completed" || newStatus === "cancelled") {
    const spot = await ParkingSpot.findById(booking.spotId);
    if (spot) {
      spot.status = "available";
      await spot.save();
    }
  }

  await booking.save();

  // Best-effort notification — a failure must not break the update.
  try {
    if (newStatus === "cancelled") {
      await notificationService.createNotification({
        userId: booking.userId,
        bookingId: booking._id,
        title: "Booking Cancelled",
        message: "Your booking has been cancelled.",
        type: "cancelled",
      });
    } else if (newStatus === "completed") {
      await notificationService.createNotification({
        userId: booking.userId,
        bookingId: booking._id,
        title: "Booking Completed",
        message: "Your booking has been completed. Rate your experience!",
        type: "booking",
      });
    }
  } catch (err) {
    console.error("Notification failed:", err.message);
  }

  return booking;
}

module.exports = {
  makeBooking,
  getUserBookings,
  getOwnerBookings,
  getAllBookings,
  updateBookingStatus,
};
