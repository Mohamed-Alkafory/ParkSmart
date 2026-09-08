const mongoose = require('mongoose');

/**
 * User Model — مستخدمي التطبيق
 *
 * الـ Roles:
 *   - driver  → السائق اللي بيحجز
 *   - owner   → صاحب الجراج
 *   - admin   → المدير (مش بيظهر في الـ UI)
 *
 * ملاحظة: الـ password بيتخزن دايماً hashed (bcrypt) — مش plain text أبداً
 */
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed بـ bcrypt
    role:     { type: String, enum: ['driver', 'owner', 'admin'], default: 'driver' },
    phone:    { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
