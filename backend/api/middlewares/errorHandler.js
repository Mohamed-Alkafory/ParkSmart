/**
 * errorHandler Middleware
 * معالج الأخطاء العام — لازم يتحط آخر حاجة في index.js بعد كل الـ routes
 *
 * بيمسك أي خطأ اتبعت بـ next(err) من أي controller
 * ويرد بـ response موحد
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حصل خطأ في السيرفر',
  });
}

module.exports = errorHandler;
