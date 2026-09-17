const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');

/**
 * upload.middleware.js
 * Local-disk image upload (multer) shared by user avatars and parking images.
 *
 * - Storage: backend/uploads/ with unique filenames to avoid collisions.
 * - Accepts JPEG / PNG / WebP only, max 5MB.
 * - Old files are removed via deleteUploadByUrl() when replaced.
 */

// Absolute path to backend/uploads (middleware lives in api/middlewares).
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  const err = new Error('Only JPEG, PNG or WebP images are allowed');
  err.status = 400;
  return cb(err);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * uploadSingle(fieldName)
 * Runs multer for one file field and translates multer errors into
 * { success: false, message } responses matching the project shape,
 * so they never surface as 500s from the global errorHandler.
 */
function uploadSingle(fieldName) {
  const single = upload.single(fieldName);
  return (req, res, next) => {
    single(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Image must be smaller than 5MB' });
      }
      const status = err.status || 400;
      return res.status(status).json({ success: false, message: err.message || 'Invalid image upload' });
    });
  };
}

/**
 * deleteUploadByUrl(urlPath)
 * Removes a previously stored /uploads/<file> from disk.
 * Never throws — a missing old file must not fail the request.
 *
 * @param {string|null|undefined} urlPath - e.g. "/uploads/123-abc.png"
 */
function deleteUploadByUrl(urlPath) {
  try {
    if (!urlPath || typeof urlPath !== 'string' || !urlPath.startsWith('/uploads/')) return;
    const fileName = path.basename(urlPath);
    // basename strips any directory traversal — only delete inside uploadsDir.
    if (!fileName || fileName === '.gitkeep') return;
    const fullPath = path.join(uploadsDir, fileName);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch {
    // Old-file cleanup is best-effort only.
  }
}

module.exports = { uploadSingle, deleteUploadByUrl, uploadsDir };
