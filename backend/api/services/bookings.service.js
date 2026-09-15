const Booking = require("../models/booking.model");
const ParkingSpot = require("../models/spot.model");
const Parking = require("../models/parking.model");
const notificationService = require("./notification.service");

/**
 * makeBooking
 * بيعمل حجز جديد + notification تلقائي (Booking Confirmed)
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

  // notification تلقائي — لو فشل ميوقعش الحجز
  try {
    await notificationService.createNotification({
      userId,
      bookingId: booking._id,
      title: "Booking Confirmed",
      message: `Your booking at ${parking.name} is confirmed.`,
      type: "booking",
    });
  } catch (err) {
    console.error("⚠️ Notification failed:", err.message);
  }

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
 * getOwnerBookings
 * بيجيب حجوزات كل الجراجات بتاعة owner معين
 * بيستخدم في owner/bookings page
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
 * getAllBookings
 * بيجيب كل الحجوزات — admin فقط
 * بيستخدم في admin/bookings page
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
 * بيغير حالة الحجز + notification تلقائي (Completed/Cancelled)
 * مسموح لصاحب الحجز، أو صاحب الجراج، أو الـ admin
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
      const err = new Error("مش مسموح لك بالوصول ده");
      err.status = 403;
      throw err;
    }
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

  // notification تلقائي — لو فشل ميوقعش الـ update
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
    console.error("⚠️ Notification failed:", err.message);
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
