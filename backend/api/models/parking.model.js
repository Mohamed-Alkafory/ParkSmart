const mongoose = require('mongoose');

/**
 * Parking Model — الجراجات
 *
 * location: بيتخزن كـ GeoJSON Point عشان نقدر نعمل بحث جغرافي ($near)
 *   coordinates: [longitude, latitude]  ← ترتيب مهم! lng الأول
 *
 * rating: بيتحسب تلقائياً من الـ Reviews — مش بيتكتب يدوي
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
    rating: { type: Number, default: 0 }, // متوسط تقييمات الـ Reviews
  },
  { timestamps: true }
);

// ⚠️ Index مهم جداً عشان البحث بـ $near يشتغل
parkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Parking', parkingSchema);
