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