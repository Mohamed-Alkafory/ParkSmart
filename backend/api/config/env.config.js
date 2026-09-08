/**
 * env.config.js
 * كل المتغيرات البيئية اللي بيستخدمها التطبيق
 * يتم تحميلها من ملف .env باستخدام dotenv
 *
 * ⚠️ لو عايز تضيف متغير جديد:
 *    1. ضيفه هنا
 *    2. ضيفه في ملف .env
 *    3. ضيفه في ملف .env.example (من غير القيمة الحقيقية)
 */

require('dotenv').config();

module.exports = {
  // ──────────────── Server ────────────────
  PORT: process.env.PORT || 3000,

  // ──────────────── Database ────────────────
  MONGO_URI: process.env.MONGO_URI,

  // ──────────────── JWT ────────────────
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // ──────────────── Environment ────────────────
  NODE_ENV: process.env.NODE_ENV || 'development',

  // TODO: لو هتضيف Email Service أو أي متغيرات تانية حطها هنا
};
