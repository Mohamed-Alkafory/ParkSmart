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

  // ──────────────── Google OAuth ────────────────
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // ──────────────── Facebook OAuth ────────────────
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

  // ──────────────── OAuth URLs ────────────────
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',

  // ──────────────── OAuth Redirects ────────────────
  OAUTH_SUCCESS_REDIRECT: process.env.OAUTH_SUCCESS_REDIRECT || `${process.env.FRONTEND_URL || 'http://localhost:4200'}/oauth-callback`,
  OAUTH_FAILURE_REDIRECT: process.env.OAUTH_FAILURE_REDIRECT || `${process.env.FRONTEND_URL || 'http://localhost:4200'}/login`,
};
