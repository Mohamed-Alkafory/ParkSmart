const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

const {
  register,
  login,
  googleCallback,
  facebookCallback,
} = require('../controller/auth.controller');

/**
 * Auth Routes
 * Base: /api/auth
 *
 * POST /api/auth/register  → register a new user
 * POST /api/auth/login     → log in and receive a JWT token
 *
 * Google OAuth:
 *   GET /api/auth/google          → يبدأ الـ login مع Google
 *   GET /api/auth/google/callback → الـ callback بعد نجاح الفلوج بتاع Google
 *
 * Facebook OAuth:
 *   GET /api/auth/facebook          → يبدأ الـ login مع Facebook
 *   GET /api/auth/facebook/callback → الـ callback بعد نجاح الفلوج بتاع Facebook
 *
 * Possible additions:
 *   - POST /api/auth/logout  (if token blacklist is introduced)
 *   - GET  /api/auth/me      → fetch the current user
 *   - POST /api/auth/refresh → refresh the token
 */

router.post('/register', register);
router.post('/login', login);

// ─── Google OAuth ───
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/oauth/failure',
  }),
  googleCallback
);

// ─── Facebook OAuth ───
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/api/auth/oauth/failure',
  }),
  facebookCallback
);

// Unified failure redirect for both providers
router.get('/oauth/failure', (req, res) => {
  const base =
    process.env.OAUTH_FAILURE_REDIRECT || 'http://localhost:4200/login';

  const query = new URLSearchParams({
    error: 'OAuth authentication failed',
  });

  res.redirect(`${base}?${query.toString()}`);
});

module.exports = router;