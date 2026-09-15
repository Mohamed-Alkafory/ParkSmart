const express = require('express');
const router  = express.Router();
const { register, login } = require('../controller/auth.controller');


/**
 * Auth Routes
 * Base: /api/auth
 *
 * POST /api/auth/register  → register a new user
 * POST /api/auth/login     → log in and receive a JWT token
 *
 * Possible additions:
 *   - POST /api/auth/logout  (if token blacklist is introduced)
 *   - GET  /api/auth/me      → fetch the current user
 *   - POST /api/auth/refresh → refresh the token
 */

router.post('/register', register);
router.post('/login',    login);

module.exports = router;
