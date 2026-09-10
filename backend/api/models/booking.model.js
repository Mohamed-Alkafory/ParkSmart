const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    spotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: true,
    },
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    startTime: { type: Date, required: true },
    durationHours: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    statusHistory: {
      type: [
        {
          status: { type: String, required: true },
          changedAt: { type: Date, default: Date.now },
        },
      ],
      default: [{ status: "active", changedAt: new Date() }],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
