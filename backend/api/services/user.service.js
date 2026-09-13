const User = require("../models/user.model");

// ===================== Read =====================

async function getUsers() {
  return await User.find().select("-password");
}

async function getUserById(id) {
  return await User.findById(id).select("-password");
}

// ===================== Update =====================

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
}

// ===================== Delete =====================

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};