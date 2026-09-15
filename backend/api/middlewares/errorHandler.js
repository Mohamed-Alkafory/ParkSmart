/**
 * errorHandler
 * Global error handler — must be registered last in index.js, after all routes.
 * Catches any error passed via next(err) and returns a unified response.
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err.stack);

  // Malformed ObjectId (e.g. GET /api/users/abc) — client error, not server error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Mongoose schema validation (runValidators: true on updates)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation failed',
    });
  }

  // Duplicate key (e.g. email already taken on admin email change)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value: already exists',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
