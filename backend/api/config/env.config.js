/**
 * env.config.js
 * All environment variables used by the app, loaded from .env via dotenv.
 *
 * To add a new variable:
 *    1. Add it here
 *    2. Add it to the .env file
 *    3. Add it to .env.example (without the real value)
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

  // Add future variables (e.g. Email Service) here
};
