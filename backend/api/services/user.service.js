const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { deleteUploadByUrl } = require("../middlewares/upload.middleware");

// Same password rule as auth.service.js register
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

async function getUsers() {
  return await User.find().select("-password");
}

async function getUserById(id) {
  return await User.findById(id).select("-password");
}

// Whitelist updatable fields to prevent mass assignment:
//   - anyone (self): name, phone, password (hashed before save)
//   - admin only: role, email
// Throws on invalid password or invalid role.
async function updateUser(id, data, isAdmin = false) {
  const update = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.phone !== undefined) update.phone = data.phone;

  if (data.password !== undefined) {
    if (!passwordRegex.test(data.password)) {
      throw new Error(
        "Password must contain uppercase, lowercase, number and special character"
      );
    }
    update.password = await bcrypt.hash(data.password, 10);
  }

  if (isAdmin) {
    if (data.role !== undefined) {
      if (!["driver", "owner", "admin"].includes(data.role)) {
        throw new Error("Invalid role");
      }
      update.role = data.role;
    }
    if (data.email !== undefined) update.email = data.email;
  }

  return await User.findByIdAndUpdate(
    id,
    update,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// Replaces the user's avatar. Removes the previous upload from disk
// so orphaned files do not accumulate (best-effort, never throws).
async function setUserAvatar(id, avatarUrl) {
  const user = await User.findById(id);
  if (!user) return null;

  const oldUrl = user.avatarUrl;
  user.avatarUrl = avatarUrl;
  await user.save();

  if (oldUrl && oldUrl !== avatarUrl) deleteUploadByUrl(oldUrl);

  user.password = undefined;
  return user;
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setUserAvatar,
};
