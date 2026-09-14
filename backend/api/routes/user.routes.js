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
} = require("../middlewares/auth.middleware");

// Get all users
router.get("/", requireAuth, getUsers);

// Get user by ID
router.get("/:id", requireAuth, getUserById);

// Update user
router.patch("/:id", requireAuth, updateUser);

// Delete user
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteUser
);

module.exports = router;