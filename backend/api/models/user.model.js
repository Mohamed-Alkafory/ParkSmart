const mongoose = require("mongoose");

/**
 * User Model
 *
 * Roles:
 *   - driver → books spots
 *   - owner  → owns parkings
 *   - admin  → manages the platform
 *
 * Note: passwords are always stored hashed with bcrypt, never plain text
 * (hashing happens in auth.service.js and user.service.js).
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 3,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["driver", "owner", "admin"],
      default: "driver",
    },

    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
