const mongoose = require('mongoose');

/**
 * Parking Model
 *
 * location is stored as a GeoJSON Point for geospatial ($near) search.
 *   coordinates: [longitude, latitude] — order matters, lng first.
 *
 * rating is computed automatically from Reviews — never written manually.
 */
const parkingSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    address:      { type: String, required: true },
    ownerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pricePerHour: { type: Number, required: true },
    location: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Required for $near queries to work.
parkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Parking', parkingSchema);
