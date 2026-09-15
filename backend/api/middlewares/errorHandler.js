/**
 * errorHandler Middleware
 * معالج الأخطاء العام — لازم يتحط آخر حاجة في index.js بعد كل الـ routes
 *
 * بيمسك أي خطأ اتبعت بـ next(err) من أي controller
 * ويرد بـ response موحد
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.stack);

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
    message: err.message || 'حصل خطأ في السيرفر',
  });
}

module.exports = errorHandler;
