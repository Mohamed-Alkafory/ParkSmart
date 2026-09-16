const userService = require("../services/user.service");

/**
 * GET /api/users — admin only.
 */
async function getUsers(req, res, next) {
  try {
    const data = await userService.getUsers();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id — self or admin.
 */
async function getUserById(req, res, next) {
  try {
    const data = await userService.getUserById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/users/:id — self or admin.
 */
async function updateUser(req, res, next) {
  try {
    const data = await userService.updateUser(
      req.params.id,
      req.body,
      req.user && req.user.role === "admin"
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/users/:id — admin only.
 */
async function deleteUser(req, res, next) {
  try {
    const data = await userService.deleteUser(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
