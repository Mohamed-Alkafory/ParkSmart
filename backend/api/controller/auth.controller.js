const authService = require("../services/auth.service");

const {
  OAUTH_SUCCESS_REDIRECT,
  OAUTH_FAILURE_REDIRECT,
} = require("../config/env.config");

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const data = await authService.registerUser({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password",
      });
    }

    const data = await authService.loginUser({
      email,
      password,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/google/callback
 * Google OAuth callback — passport sets req.user = { provider, providerId, email, name }
 */
async function googleCallback(req, res) {
  await handleOAuthCallback(req, res);
}

/**
 * GET /api/auth/facebook/callback
 * Facebook OAuth callback
 */
async function facebookCallback(req, res) {
  await handleOAuthCallback(req, res);
}

async function handleOAuthCallback(req, res) {
  try {
    const data = await authService.findOrCreateOAuthUser(req.user);

    const query = new URLSearchParams({
      token: data.token,
      user: JSON.stringify(data.user),
    });

    return res.redirect(`${OAUTH_SUCCESS_REDIRECT}?${query.toString()}`);
  } catch (err) {
    const query = new URLSearchParams({ error: err.message });
    return res.redirect(`${OAUTH_FAILURE_REDIRECT}?${query.toString()}`);
  }
}

module.exports = {
  register,
  login,
  googleCallback,
  facebookCallback,
};