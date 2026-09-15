const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

const {
  requireAuth,
  requireRole,
  requireSelfOrAdmin,
} = require("../middlewares/auth.middleware");

// Get all users (admin only â€” contains PII)
router.get("/", requireAuth, requireRole("admin"), getUsers);

// Get user by ID (self or admin)
router.get("/:id", requireAuth, requireSelfOrAdmin, getUserById);

// Update user (self or admin â€” see user.service for field whitelist)
router.patch("/:id", requireAuth, requireSelfOrAdmin, updateUser);

// Delete user
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteUser
);

module.exports = router;
