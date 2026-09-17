const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require("../controller/user.controller");

const {
  requireAuth,
  requireRole,
  requireSelfOrAdmin,
} = require("../middlewares/auth.middleware");

const { uploadSingle } = require("../middlewares/upload.middleware");

// Get all users (admin only â€” contains PII)
router.get("/", requireAuth, requireRole("admin"), getUsers);

// Get user by ID (self or admin)
router.get("/:id", requireAuth, requireSelfOrAdmin, getUserById);

// Update user (self or admin â€” see user.service for field whitelist)
router.patch("/:id", requireAuth, requireSelfOrAdmin, updateUser);

// Upload avatar (self or admin) — multipart/form-data, field "image"
router.post("/:id/avatar", requireAuth, requireSelfOrAdmin, uploadSingle("image"), uploadAvatar);

// Delete user
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteUser
);

module.exports = router;
