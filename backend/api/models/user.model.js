const mongoose = require("mongoose");

/**
 * User Model — مستخدمي التطبيق
 *
 * Roles:
 *   - driver → السائق اللي بيحجز
 *   - owner  → صاحب الجراج
 *   - admin  → المدير
 *
 * ملاحظة:
 * الـ password بيتخزن دائماً hashed باستخدام bcrypt
 * وليس plain text.
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